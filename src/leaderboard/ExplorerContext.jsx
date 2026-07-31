import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExplorerContext } from './useExplorer';
const API_BASE = String(import.meta.env.VITE_LEADERBOARD_API_URL || '/api').replace(/\/$/, '');
const PROFILE_KEY = 'sofia-explorer-profile-v1';
const PENDING_KEY = 'sofia-explorer-pending-scores-v1';

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function challengeKey(detail) {
  return [detail.activity, detail.difficulty, detail.chapter, detail.seed].join(':');
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
  });
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('La clasificación no está disponible en este momento.');
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || 'No fue posible conectar con la clasificación.');
    error.code = payload.error;
    error.status = response.status;
    throw error;
  }
  return payload;
}

export function ExplorerProvider({ children }) {
  const storedProfile = useMemo(() => readJson(PROFILE_KEY, null), []);
  const [credential, setCredential] = useState(storedProfile);
  const [player, setPlayer] = useState(storedProfile?.player || null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(Boolean(storedProfile?.token));
  const [notice, setNotice] = useState(null);
  const credentialRef = useRef(storedProfile);
  const challengesRef = useRef(new Map());
  const pendingCompletionsRef = useRef(readJson(PENDING_KEY, []));

  const persistCredential = useCallback((nextCredential) => {
    credentialRef.current = nextCredential;
    setCredential(nextCredential);
    if (nextCredential) localStorage.setItem(PROFILE_KEY, JSON.stringify(nextCredential));
    else localStorage.removeItem(PROFILE_KEY);
  }, []);

  const persistPending = useCallback(() => {
    localStorage.setItem(PENDING_KEY, JSON.stringify(pendingCompletionsRef.current.slice(-20)));
  }, []);

  const submitScore = useCallback(async (completion, tokenOverride) => {
    const token = tokenOverride || credentialRef.current?.token;
    if (!token) {
      pendingCompletionsRef.current.push(completion);
      persistPending();
      setProfileOpen(true);
      setNotice({ type: 'info', message: 'Elige tu nombre de explorador para guardar estos puntos.' });
      return null;
    }

    try {
      const result = await apiRequest('/scores', {
        method: 'POST',
        token,
        body: JSON.stringify(completion),
      });
      setPlayer(result.player);
      const nextCredential = { token, player: result.player };
      persistCredential(nextCredential);
      setNotice({
        type: result.awardedPoints > 0 ? 'success' : 'info',
        message: result.awardedPoints > 0
          ? `+${result.awardedPoints} puntos para tu pasaporte.`
          : 'Ya tenías una marca igual o mejor en este reto.',
      });
      return result;
    } catch (error) {
      if (error.status === 401) {
        persistCredential(null);
        setPlayer(null);
        setProfileOpen(true);
      } else {
        pendingCompletionsRef.current.push(completion);
        persistPending();
      }
      setNotice({ type: 'error', message: error.message });
      return null;
    }
  }, [persistCredential, persistPending]);

  const flushPending = useCallback(async (token) => {
    const queue = [...pendingCompletionsRef.current];
    pendingCompletionsRef.current = [];
    persistPending();
    for (const completion of queue) {
      await submitScore(completion, token);
    }
  }, [persistPending, submitScore]);

  const createExplorer = useCallback(async (name) => {
    const result = await apiRequest('/players', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    const nextCredential = { token: result.token, player: result.player };
    persistCredential(nextCredential);
    setPlayer(result.player);
    setProfileOpen(false);
    setNotice({ type: 'success', message: `Bienvenido, ${result.player.displayName}.` });
    await flushPending(result.token);
    return result.player;
  }, [flushPending, persistCredential]);

  const renameExplorer = useCallback(async (name) => {
    const token = credentialRef.current?.token;
    if (!token) return createExplorer(name);
    const result = await apiRequest('/players/me', {
      method: 'PATCH',
      token,
      body: JSON.stringify({ name }),
    });
    setPlayer(result.player);
    persistCredential({ token, player: result.player });
    setProfileOpen(false);
    setNotice({ type: 'success', message: 'Tu nombre de explorador fue actualizado.' });
    return result.player;
  }, [createExplorer, persistCredential]);

  const loadLeaderboard = useCallback((period = 'all') => (
    apiRequest(`/leaderboard?period=${period}&limit=50`)
  ), []);

  useEffect(() => {
    const token = credentialRef.current?.token;
    if (!token) {
      setProfileLoading(false);
      return undefined;
    }
    let active = true;
    apiRequest('/players/me', { token })
      .then((result) => {
        if (!active) return;
        setPlayer(result.player);
        persistCredential({ token, player: result.player });
        if (pendingCompletionsRef.current.length) flushPending(token);
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401) {
          persistCredential(null);
          setPlayer(null);
        }
      })
      .finally(() => active && setProfileLoading(false));
    return () => { active = false; };
  }, [flushPending, persistCredential]);

  useEffect(() => {
    const onMessage = async (event) => {
      if (event.origin !== window.location.origin || !event.data?.type?.startsWith('sofia:game-')) return;
      const detail = event.data.detail;
      if (!detail) return;
      const key = challengeKey(detail);

      if (event.data.type === 'sofia:game-ready') {
        try {
          const result = await apiRequest('/challenges', {
            method: 'POST',
            body: JSON.stringify(detail),
          });
          challengesRef.current.set(key, result.challengeToken);
        } catch {
          challengesRef.current.delete(key);
        }
        return;
      }

      if (event.data.type === 'sofia:game-complete') {
        const challengeToken = challengesRef.current.get(key);
        if (!challengeToken) {
          setNotice({ type: 'error', message: 'No pudimos validar este reto. Abre un tablero nuevo para sumar puntos.' });
          return;
        }
        await submitScore({
          challengeToken,
          durationSeconds: detail.durationSeconds,
          hintsUsed: detail.hintsUsed,
          metrics: detail.metrics || {},
        });
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [submitScore]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const value = useMemo(() => ({
    player,
    credential,
    profileLoading,
    profileOpen,
    notice,
    openProfile: () => setProfileOpen(true),
    closeProfile: () => setProfileOpen(false),
    clearNotice: () => setNotice(null),
    createExplorer,
    renameExplorer,
    loadLeaderboard,
  }), [credential, createExplorer, loadLeaderboard, notice, player, profileLoading, profileOpen, renameExplorer]);

  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>;
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PrivacyContext } from './usePrivacy';

const API_BASE = String(import.meta.env.VITE_LEADERBOARD_API_URL || '/api').replace(/\/$/, '');
const CONSENT_KEY = 'sofia-privacy-consent-v1';
const VISITOR_KEY = 'sofia-anonymous-visitor-v1';
const SESSION_KEY = 'sofia-anonymous-session-v1';
const CONSENT_VERSION = 1;
const SESSION_DURATION_MS = 30 * 60 * 1000;

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function readConsent() {
  const saved = readJson(CONSENT_KEY);

  if (saved?.version !== CONSENT_VERSION || typeof saved.analytics !== 'boolean') {
    return null;
  }

  return saved;
}

function createUuid() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

function getVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_KEY);

  if (!visitorId) {
    visitorId = createUuid();
    localStorage.setItem(VISITOR_KEY, visitorId);
  }

  return visitorId;
}

function getSessionId() {
  const now = Date.now();
  const saved = readJson(SESSION_KEY);
  const isActive = saved?.id && Number.isFinite(saved.lastSeen) && now - saved.lastSeen < SESSION_DURATION_MS;
  const session = isActive ? { ...saved, lastSeen: now } : { id: createUuid(), lastSeen: now };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session.id;
}

async function requestJson(path, options) {
  const response = await fetch(`${API_BASE}${path}`, options);

  if (!response.ok) {
    throw new Error(`Analytics API respondió ${response.status}`);
  }

  return response.json();
}

export function PrivacyProvider({ children }) {
  const location = useLocation();
  const initialConsent = useMemo(readConsent, []);
  const [consent, setConsent] = useState(initialConsent);
  const [preferencesOpen, setPreferencesOpen] = useState(!initialConsent);
  const [explorerCount, setExplorerCount] = useState(null);
  const lastTrackedRef = useRef('');

  const refreshExplorerCount = useCallback(async () => {
    try {
      const data = await requestJson('/analytics/summary');
      setExplorerCount(Number(data.explorers) || 0);
    } catch {
      setExplorerCount((current) => current ?? 0);
    }
  }, []);

  useEffect(() => {
    refreshExplorerCount();
  }, [refreshExplorerCount]);

  useEffect(() => {
    if (!consent?.analytics) return;

    const trackingKey = `${location.pathname}:${Math.floor(Date.now() / 60_000)}`;
    if (lastTrackedRef.current === trackingKey) return;
    lastTrackedRef.current = trackingKey;

    const recordVisit = async () => {
      try {
        const data = await requestJson('/analytics/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId: getVisitorId(),
            sessionId: getSessionId(),
            path: location.pathname,
          }),
        });
        setExplorerCount(Number(data.explorers) || 0);
      } catch {
        // Las estadísticas nunca deben interrumpir la experiencia educativa.
      }
    };

    recordVisit();
  }, [consent, location.pathname]);

  const saveConsent = useCallback((analytics) => {
    const nextConsent = {
      version: CONSENT_VERSION,
      analytics,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(nextConsent));
    setConsent(nextConsent);
    setPreferencesOpen(false);
  }, []);

  const acceptAnalytics = useCallback(() => {
    saveConsent(true);
  }, [saveConsent]);

  const declineAnalytics = useCallback(() => {
    const visitorId = localStorage.getItem(VISITOR_KEY);

    if (visitorId) {
      fetch(`${API_BASE}/analytics/forget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId }),
        keepalive: true,
      }).catch(() => {});
    }

    localStorage.removeItem(VISITOR_KEY);
    localStorage.removeItem(SESSION_KEY);
    lastTrackedRef.current = '';
    saveConsent(false);
  }, [saveConsent]);

  const value = useMemo(
    () => ({
      consent,
      preferencesOpen,
      explorerCount,
      acceptAnalytics,
      declineAnalytics,
      openPrivacyPreferences: () => setPreferencesOpen(true),
    }),
    [acceptAnalytics, consent, declineAnalytics, explorerCount, preferencesOpen],
  );

  return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>;
}

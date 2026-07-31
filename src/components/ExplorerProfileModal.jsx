import React, { useEffect, useState } from 'react';
import { Compass, X } from 'lucide-react';
import { useExplorer } from '../leaderboard/useExplorer';

const ExplorerProfileModal = () => {
  const { player, profileOpen, closeProfile, createExplorer, renameExplorer } = useExplorer();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profileOpen) {
      setName(player?.displayName || '');
      setError('');
    }
  }, [player, profileOpen]);

  if (!profileOpen) return null;

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (player) await renameExplorer(name);
      else await createExplorer(name);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#102719]/75 px-4 py-8 flex items-center justify-center" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="explorer-profile-title"
        className="relative w-full max-w-md rounded-lg bg-[#fffdf7] border border-[#d8d1bf] shadow-2xl p-7"
      >
        <button
          type="button"
          onClick={closeProfile}
          className="absolute right-4 top-4 p-2 text-[#1A311C] hover:bg-[#edf3df] rounded-md"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-12 rounded-full bg-[#e7efd7] text-[#1A311C] flex items-center justify-center mb-5">
          <Compass size={25} />
        </div>
        <p className="text-xs uppercase font-bold text-[#78a130] tracking-widest">Pasaporte del explorador</p>
        <h2 id="explorer-profile-title" className="mt-2 text-3xl font-black text-[#1A311C]">
          {player ? 'Tu nombre público' : 'Elige tu nombre'}
        </h2>

        <form onSubmit={submit} className="mt-6">
          <label htmlFor="explorer-name" className="block text-sm font-bold text-[#1A311C] mb-2">
            Nombre de explorador
          </label>
          <input
            id="explorer-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={3}
            maxLength={20}
            autoComplete="nickname"
            autoFocus
            className="w-full h-12 px-4 rounded-md border border-[#aeb99e] bg-white text-[#1A311C] outline-none focus:ring-2 focus:ring-[#78a130]"
            placeholder="Ej. Rana Verde"
          />
          <p className="mt-2 text-xs text-gray-500">Se mostrará en la clasificación. No uses tu nombre completo.</p>
          {error && <p className="mt-3 text-sm font-semibold text-[#a23b32]" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={saving || name.trim().length < 3}
            className="mt-6 w-full h-12 rounded-md bg-[#1A311C] text-white font-bold hover:bg-[#315b35] disabled:opacity-50"
          >
            {saving ? 'Guardando...' : player ? 'Actualizar nombre' : 'Crear mi pasaporte'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ExplorerProfileModal;

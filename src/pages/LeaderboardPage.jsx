import React, { useCallback, useEffect, useState } from 'react';
import { Compass, Medal, RefreshCw, Trophy } from 'lucide-react';
import { useExplorer } from '../leaderboard/useExplorer';

const LeaderboardPage = () => {
  const { player, profileLoading, openProfile, loadLeaderboard } = useExplorer();
  const [period, setPeriod] = useState('all');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await loadLeaderboard(period);
      setRows(result.leaderboard || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [loadLeaderboard, period]);

  useEffect(() => { load(); }, [load]);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f4eb] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-[#cfd6c0] pb-7 sm:flex sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#78a130]">Pasaporte del explorador</p>
            <h1 className="mt-2 text-3xl font-black text-[#1A311C] sm:text-4xl">Clasificación de exploradores</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#59625a]">
              Completa las actividades, mejora tus marcas y suma puntos con un nombre público de explorador.
            </p>
          </div>
          <button
            type="button"
            onClick={openProfile}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-[#1A311C] px-4 text-sm font-bold text-white hover:bg-[#315b35] sm:mt-0"
          >
            <Compass size={18} />
            {player ? 'Editar pasaporte' : 'Crear mi pasaporte'}
          </button>
        </header>

        {player && !profileLoading && (
          <section className="mt-7 grid gap-4 border-y border-[#cfd6c0] bg-[#eef4e2] px-5 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center" aria-label="Tu progreso">
            <div>
              <span className="text-xs font-bold uppercase text-[#708069]">Tu explorador</span>
              <strong className="mt-1 block text-xl text-[#1A311C]">{player.displayName}</strong>
            </div>
            <div className="sm:border-l sm:border-[#c8d1ba] sm:pl-7">
              <span className="text-xs font-bold uppercase text-[#708069]">Puntos</span>
              <strong className="mt-1 block text-xl text-[#1A311C]">{player.points || 0}</strong>
            </div>
            <div className="sm:border-l sm:border-[#c8d1ba] sm:pl-7">
              <span className="text-xs font-bold uppercase text-[#708069]">Posición</span>
              <strong className="mt-1 block text-xl text-[#1A311C]">{player.position ? `#${player.position}` : 'Sin marca'}</strong>
            </div>
          </section>
        )}

        <section className="mt-8" aria-labelledby="ranking-title">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Trophy size={22} className="text-[#9a6b2f]" />
              <h2 id="ranking-title" className="text-2xl font-black text-[#1A311C]">Tabla de posiciones</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 rounded-md border border-[#aeb99e] bg-white p-1" aria-label="Periodo">
                <button type="button" onClick={() => setPeriod('all')} className={`rounded px-3 py-2 text-xs font-bold ${period === 'all' ? 'bg-[#1A311C] text-white' : 'text-[#53614e] hover:bg-[#eff3e7]'}`}>General</button>
                <button type="button" onClick={() => setPeriod('week')} className={`rounded px-3 py-2 text-xs font-bold ${period === 'week' ? 'bg-[#1A311C] text-white' : 'text-[#53614e] hover:bg-[#eff3e7]'}`}>Esta semana</button>
              </div>
              <button type="button" onClick={load} className="grid h-10 w-10 place-items-center rounded-md border border-[#aeb99e] bg-white text-[#1A311C] hover:bg-[#eff3e7]" aria-label="Actualizar clasificación">
                <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-md border border-[#cfd2c5] bg-white shadow-sm">
            <div className="grid grid-cols-[64px_1fr_90px] bg-[#1A311C] px-4 py-3 text-[11px] font-black uppercase tracking-wider text-white sm:grid-cols-[80px_1fr_120px_120px]">
              <span>Pos.</span><span>Explorador</span><span className="text-right">Puntos</span><span className="hidden text-right sm:block">Retos</span>
            </div>
            {loading && <p className="px-5 py-10 text-center text-sm text-[#647060]">Actualizando posiciones...</p>}
            {!loading && error && <p className="px-5 py-10 text-center text-sm font-semibold text-[#8e3730]">{error}</p>}
            {!loading && !error && !rows.length && <p className="px-5 py-10 text-center text-sm text-[#647060]">Todavía no hay puntajes en este periodo.</p>}
            {!loading && !error && rows.map((row) => {
              const isCurrent = player?.displayName === row.name;
              return (
                <div key={`${row.position}-${row.name}`} className={`grid min-h-14 grid-cols-[64px_1fr_90px] items-center border-t border-[#e1e3da] px-4 py-3 text-sm sm:grid-cols-[80px_1fr_120px_120px] ${isCurrent ? 'bg-[#eef4e2]' : ''}`}>
                  <span className="flex items-center gap-2 font-black text-[#465542]">
                    {row.position <= 3 ? <Medal size={17} className={row.position === 1 ? 'text-[#b27b27]' : row.position === 2 ? 'text-[#77827b]' : 'text-[#9a6241]'} /> : null}
                    {row.position}
                  </span>
                  <strong className="min-w-0 truncate text-[#1A311C]">{row.name}{isCurrent ? ' (tú)' : ''}</strong>
                  <span className="text-right font-black text-[#1A311C]">{row.points}</span>
                  <span className="hidden text-right text-[#647060] sm:block">{row.completed}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs leading-5 text-[#6b7468]">Solo se muestra el nombre de explorador. Cada reto conserva tu mejor marca por capítulo y dificultad.</p>
        </section>
      </div>
    </main>
  );
};

export default LeaderboardPage;

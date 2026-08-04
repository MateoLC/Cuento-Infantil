import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePrivacy } from '../privacy/usePrivacy';

export default function PrivacyConsentBanner() {
  const { preferencesOpen, acceptAnalytics, declineAnalytics } = usePrivacy();

  if (!preferencesOpen) return null;

  return (
    <section
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-[#aab999] bg-[#fffdf5] px-5 py-5 shadow-[0_-8px_32px_rgba(20,54,31,0.18)]"
      aria-label="Preferencias de privacidad"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-4xl gap-4">
          <ShieldCheck className="mt-0.5 shrink-0 text-[#173c24]" size={28} aria-hidden="true" />
          <div>
            <h2 className="font-display text-xl font-black text-[#173c24]">Privacidad para exploradores</h2>
            <p className="mt-1 text-sm leading-6 text-[#475569]">
              Usamos almacenamiento necesario para recordar tus preferencias. Con autorización de un adulto responsable,
              podemos usar un identificador anónimo para contar exploradores y conocer qué secciones se visitan. No usamos
              publicidad ni seguimiento entre sitios. Si eres niño, pídele a un adulto que elija.
            </p>
            <p className="mt-2 flex gap-4 text-sm font-bold text-[#315b35]">
              <Link className="underline decoration-1 underline-offset-4" to="/privacidad">Privacidad</Link>
              <Link className="underline decoration-1 underline-offset-4" to="/terminos">Términos</Link>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={declineAnalytics}
            className="min-h-11 rounded-md border border-[#315b35] px-5 text-sm font-black text-[#173c24] transition-colors hover:bg-[#eef5e7]"
          >
            Solo necesarias
          </button>
          <button
            type="button"
            onClick={acceptAnalytics}
            className="min-h-11 rounded-md bg-[#173c24] px-5 text-sm font-black text-white transition-colors hover:bg-[#285b35]"
          >
            Soy adulto: autorizar
          </button>
        </div>
      </div>
    </section>
  );
}

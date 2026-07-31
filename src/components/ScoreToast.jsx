import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useExplorer } from '../leaderboard/useExplorer';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'border-[#789d42] bg-[#f2f7e8] text-[#244629]',
  error: 'border-[#bd665c] bg-[#fff2ef] text-[#7a2822]',
  info: 'border-[#9aad87] bg-[#fffdf7] text-[#244629]',
};

const ScoreToast = () => {
  const { notice, clearNotice } = useExplorer();
  if (!notice) return null;

  const Icon = icons[notice.type] || Info;

  return (
    <div
      className={`fixed right-4 top-24 z-[90] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-md border p-4 shadow-xl ${styles[notice.type] || styles.info}`}
      role="status"
      aria-live="polite"
    >
      <Icon size={21} className="mt-0.5 shrink-0" />
      <p className="flex-1 text-sm font-bold leading-snug">{notice.message}</p>
      <button type="button" onClick={clearNotice} className="rounded p-1 hover:bg-black/5" aria-label="Cerrar aviso">
        <X size={17} />
      </button>
    </div>
  );
};

export default ScoreToast;

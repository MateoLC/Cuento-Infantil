import { createContext, useContext } from 'react';

export const ExplorerContext = createContext(null);

export function useExplorer() {
  const value = useContext(ExplorerContext);
  if (!value) throw new Error('useExplorer must be used inside ExplorerProvider');
  return value;
}

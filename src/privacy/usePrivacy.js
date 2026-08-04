import { createContext, useContext } from 'react';

export const PrivacyContext = createContext(null);

export function usePrivacy() {
  const context = useContext(PrivacyContext);

  if (!context) {
    throw new Error('usePrivacy debe usarse dentro de PrivacyProvider');
  }

  return context;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFeatureFlags } from '@/services/featureFlags';
import { FeatureFlag } from '@/interfaces/featureFlag.interface';
import { isFeatureVisible } from '@/helpers/featureFlag';
import { isAuthenticated } from '@/services/auth';

interface FeatureFlagContextType {
  flags: FeatureFlag[];
  loading: boolean;
  /** Latches true once the first fetch settles; never returns to false. */
  hydrated: boolean;
  error: string | null;
  isVisible: (key: string) => boolean;
  refreshFlags: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

interface FeatureFlagProviderProps {
  children: ReactNode;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({ children }) => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlags = async () => {
    try {
      setLoading(true);
      const fetchedFlags = await getFeatureFlags();
      setFlags(fetchedFlags);
      setError(null);
    } catch (err) {
      setError('Failed to load feature flags');
    } finally {
      setLoading(false);
      setHydrated(true);
    }
  };

  useEffect(() => {
    // check if the user is authenticated
    if (isAuthenticated()) {
      fetchFlags();
      return;
    }
    // no fetch runs for anonymous visitors, so flag state is already final
    setHydrated(true);
  }, []);

  const isVisible = (key: string): boolean => {
    return isFeatureVisible(flags, key);
  };

  const refreshFlags = async (): Promise<void> => {
    await fetchFlags();
  };

  const value = {
    flags,
    loading,
    hydrated,
    error,
    isVisible,
    refreshFlags
  };

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFeatureFlag = (): FeatureFlagContextType => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlag must be used within a FeatureFlagProvider');
  }
  return context;
}; 
import { useFeatureFlag } from '@/context/FeatureFlagContext';

/**
 * Hook to check if a feature flag is visible. Returns false when the flag is missing.
 */
export function useFeatureFlagVisible(flagKey: string): boolean {
  const { isVisible } = useFeatureFlag();
  return isVisible(flagKey);
}

import { FeatureFlag } from "@/interfaces/featureFlag.interface";

export const isFeatureVisible = (
  featureFlags: FeatureFlag[],
  key: string,
): boolean => {
  return featureFlags.some(
    (flag) => flag.key === key && flag.is_active && flag.val === "true",
  );
};

import { describe, expect, it } from "vitest";
import { isFeatureVisible } from "@/helpers/featureFlag";
import { FeatureFlag } from "@/interfaces/featureFlag.interface";

const flag = (over: Partial<FeatureFlag>): FeatureFlag => ({
  key: "k",
  val: "true",
  description: "",
  is_active: 1,
  ...over,
});

describe("isFeatureVisible", () => {
  it("is true for an active flag with exactly this key set to 'true'", () => {
    expect(
      isFeatureVisible(
        [flag({ key: "llmSettings.showBedrockFineTune", val: "true" })],
        "llmSettings.showBedrockFineTune"
      )
    ).toBe(true);
  });

  it("ignores longer keys that share the prefix", () => {
    expect(
      isFeatureVisible(
        [
          flag({ key: "llmSettings.showBedrockFineTunes", val: "true" }),
          flag({ key: "llmSettings.showBedrockFineTune.x", val: "true" }),
          flag({ key: "llmSettings.showBedrockFineTune", val: "false" }),
        ],
        "llmSettings.showBedrockFineTune"
      )
    ).toBe(false);
  });

  it("ignores an inactive flag", () => {
    expect(
      isFeatureVisible(
        [flag({ key: "llmSettings.showBedrockFineTune", is_active: 0 })],
        "llmSettings.showBedrockFineTune"
      )
    ).toBe(false);
  });
});

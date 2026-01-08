export const PRESET_NAMES = [
  "cat",
  "blog",
  "business",
  "news",
  "sns",
  "profile_business",
  "profile_sns",
] as const;
export type PresetName = typeof PRESET_NAMES[number];

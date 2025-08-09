import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const SUPPORTED_LANGUAGES = {
  json: import("@shikijs/langs/json"),
};

export const DARK_THEME = "vesper";
export const LIGHT_THEME = "vitesse-light";

const SUPPORTED_THEMES = {
  [DARK_THEME]: import("@shikijs/themes/vesper"),
  [LIGHT_THEME]: import("@shikijs/themes/vitesse-light"),
};

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export type SupportedTheme = keyof typeof SUPPORTED_THEMES;

export function loadShikiHighlighter() {
  return createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    langs: Object.values(SUPPORTED_LANGUAGES),
    themes: Object.values(SUPPORTED_THEMES),
  });
}

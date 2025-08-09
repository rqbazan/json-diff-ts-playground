import { createSystem, defaultConfig } from "@chakra-ui/react";

export const fontMono = `"JetBrains Mono Variable",${defaultConfig.theme?.tokens?.fonts?.mono?.value}`;

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: {
          value: fontMono,
        },
        body: {
          value: fontMono,
        },
        mono: {
          value: fontMono,
        },
      },
    },
  },
});

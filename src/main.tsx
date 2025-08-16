import "@fontsource-variable/jetbrains-mono/index.css";
import { ChakraProvider, ClientOnly } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./app";
import { ColorModeProvider } from "./ui/core/color-mode";
import { system } from "./ui/core/system";
import { ToasterRoot } from "./ui/core/toaster-root";

// biome-ignore lint/style/noNonNullAssertion: index.html always has the root
const rootEl = document.getElementById("root")!;

createRoot(rootEl).render(
  <BrowserRouter>
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <ToasterRoot />
        <ClientOnly>
          <App />
        </ClientOnly>
      </ColorModeProvider>
    </ChakraProvider>
  </BrowserRouter>,
);

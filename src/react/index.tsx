import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, theme } from "@chakra-ui/react";
import App from "./App";

import "./index.css";

const container = document.getElementById("target");
const root = createRoot(container);

root.render(<div>
      <ChakraProvider theme={theme}>
          <App />
      </ChakraProvider>
</div>);
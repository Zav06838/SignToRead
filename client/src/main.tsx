import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, useNavigate } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { ClerkProvider } from "@clerk/clerk-react";



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Provider store={store}>
          
            <App />
          
        </Provider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AutorizacionesProvider from "./context/AutorizacionesContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AutorizacionesProvider>
                <App />
            </AutorizacionesProvider>
        </BrowserRouter>
    </StrictMode>
);

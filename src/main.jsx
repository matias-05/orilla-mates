import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { initMercadoPago } from "@mercadopago/sdk-react";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
  locale: "es-AR",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

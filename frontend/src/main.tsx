import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.tsx";
import { GlobalLoading } from "react-global-loading";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalLoading />
    <RouterProvider router={router} />
  </StrictMode>
);

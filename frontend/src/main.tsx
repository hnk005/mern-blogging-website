import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.tsx";
import { GlobalLoading } from "react-global-loading";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <>
    <GlobalLoading />
    <Toaster />
    <RouterProvider router={router} />
  </>
);

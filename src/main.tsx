import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/Routes.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./Redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
// this part for text editor
import { MantineProvider } from "@mantine/core"; //  import MantineProvider
import "@mantine/core/styles.css"; //  import Mantine styles
import "@mantine/tiptap/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={routes} />
          <Toaster richColors position="top-right" />
        </PersistGate>
      </Provider>
    </MantineProvider>
  </StrictMode>,
);

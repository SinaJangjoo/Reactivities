import { createRoot } from "react-dom/client";
import "./app/layout/styles.css";
import "semantic-ui-css/semantic.min.css";
import App from "./app/layout/App";
import { store, StoreContext } from "./app/stores/store";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes";
import React from "react";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <RouterProvider router={router}/>
    </StoreContext.Provider>
  </React.StrictMode>
);

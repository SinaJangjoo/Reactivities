import { createRoot } from "react-dom/client";
import "react-toastify/ReactToastify.css"
import 'react-datepicker/dist/react-datepicker.css'
import "./app/layout/styles.css";
import "semantic-ui-css/semantic.min.css";
import "react-calendar/dist/Calendar.css"  //To get some style without adding any more css code to our calendar inside our dashboard
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

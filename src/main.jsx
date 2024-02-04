import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Form from "./component/Form.jsx";
import { defineCustomElements } from "@ionic/pwa-elements/loader";

// Call the element loader before the render call
defineCustomElements(window);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Form />
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Routes, Route, HashRouter } from "react-router-dom";

import DetailPage from "./DetailPage";

import "./index.css";
// import './mcloud_theme.css';
// import './theme.css';

//const info_page_link = "https://dev-www.materialscloud.org/mcloud/api/v2/discover/mc3d/info";
//const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/details/:compound" element={<DetailPage />} /> */}
        <Route
          path="/details/:compound/:id/:functional"
          element={<DetailPage />}
        />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

reportWebVitals();

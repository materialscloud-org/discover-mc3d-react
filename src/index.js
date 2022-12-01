import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Routes, Route, HashRouter } from "react-router-dom";
import ThreeDimDataBase from "./DetailPage.js"

import './index.css';
// import './mcloud_theme.css';
// import './theme.css';

//const info_page_link = "https://dev-www.materialscloud.org/mcloud/api/v2/discover/mc3d/info";
//const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(document.getElementById("root"));

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}/>
        <Route path="/details/:compound" element={<ThreeDimDataBase />} />
        <Route path="/details/:compound/:id/:id_pp" element={<ThreeDimDataBase />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

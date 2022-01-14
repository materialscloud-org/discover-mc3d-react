import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './mcloud_theme.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThreeDimDataBase from "./DetailPage.js"
import './theme.css';

//const info_page_link = "https://dev-www.materialscloud.org/mcloud/api/v2/discover/mc3d/info";
//const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<App />}/>
    
    <Route path="details/:compound" element={<ThreeDimDataBase />} />
    
    
    <Route
      path="*"
      element={
        <main style={{ padding: "1rem" }}>
          <p>There's nothing here!</p>
        </main>
      }
    />
      
</Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
/*
      <Route path=":compound" element={<DetailPage 
            page_details_link={info_page_link}
            compound_name={compound}
          />} />
*/
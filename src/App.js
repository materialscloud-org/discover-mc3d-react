import logo from './logo.svg';
import './App.css';
import React from 'react';
import ThreeDimDataBase from './DetailPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import XrdPlot_c from './xrd/plot_xrd copy';
import { Link } from "react-router-dom";
import Compounds from "./routes/Selection_page.jsx";



function App () {
    return (
      <div className='App'>
        <Compounds />
      </div>
    );

  }
  ////<DetailPage compound="Sb2Zr" />
//<ThreeDimDataBase/>


export default App;

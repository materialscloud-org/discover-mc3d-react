import logo from './logo.svg';
import './App.css';
import React from 'react';
import Plot from 'react-plotly.js';
import XrdPlot from './xrd/plot_xrd';
import DetailPage from './DetailPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App () {
    return (
      <div className='App'>
       <DetailPage compound="Sb2Zr" />
      
      </div>
    );

  }



export default App;

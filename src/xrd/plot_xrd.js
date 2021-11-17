import React, { Component } from 'react'
import Plot from 'react-plotly.js';
import data from '../data/Sb2Zr_CuKa_fit_gauss_compact.json'

class XrdPlot extends Component {

  render() {

    return (
      <div>
      <h3>Simulated X-Ray diffraction pattern</h3>

      <Plot

        data={[

          {
            type: 'scatter',
            mode: 'lines+points',
            x: do_fitting(data).x,
            y: do_fitting(data).curve,
            marker: {color: 'red'},
            hoverinfo: "none"
          },
          {
            type: 'scatter',
            mode: 'markers',
            marker: {color: 'red'},
            marker: { size: 2 },
            x: data.peaks_positions,
            y: do_fitting(data).peaks,
            hovertemplate: 'hkl: <b>%{text}</b><extra></extra>',
            text: extract_hkl(data)
            },
    
          ]}

      
      layout = { {
          width: 660,
          height: 480,
          //title: 'Sb2Zr_Cu_Ka_fit_gauss',
          showlegend: false,
          xaxis: {title: "2\u03F4" + ", degrees"},
          yaxis: {title: "Intensity, a.u."}
        } }
      
      

      />
      </div>

    );

  }

}

export default XrdPlot;

function gaussian(a, b, c, x){
  //var x = makeArr(x_range[0], x_range[1], N);
  var y = [];
  for (let i = 0; i < x.length; i++){
    y.push(a*Math.exp(-Math.pow((x[i]-b)/c,2)/2)); 
  }
  return y;
}

function lorentz(x0, gamma, k, x){
  //var x = makeArr(x_range[0], x_range[1], N);
  var y = [];
  for (let i = 0; i < x.length; i++){
    y.push(k*Math.pow(gamma, 2)/(Math.pow(gamma, 2) + Math.pow((x[i] - x0), 2))); 
  }
  return y;
}

function makeArr(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

function do_gauss_fit(two_thetas, intensities, FWHM, x){
  var a_arr = [];
  var b_arr = two_thetas.slice();
  var c = FWHM/2/Math.pow(2*Math.log(2),0.5);
  var gaussians = [];
  var peaks = [];
  var curve = [];
  var summ = 0;
  for (let i = 0; i < intensities.length; i++){
    
    a_arr.push(2*intensities[i]*Math.pow(Math.log(2),0.5)/FWHM/Math.pow(Math.PI, 0.5)); 
    var gauss = gaussian(a_arr[i], b_arr[i], c, x);
    gaussians.push(gauss);
    peaks.push(Math.max.apply(Math, gauss));
  }
  for (let i = 0; i < x.length; i++){
    summ = 0;
    for (let j = 0; j < intensities.length; j++){
      summ = summ + gaussians[j][i];
    }
    curve.push(summ);
  }
    return {
    curve: curve,
    peaks: peaks
  };
}

function do_lorentz_fit(two_thetas, intensities, FWHM, x){
  var x0_arr = two_thetas.slice();
  var gamma = FWHM/2;
  var k_arr = [];
  var lorentzians = [];
  var peaks = [];
  var summ = 0;
  var curve = [];
  
  for (let i = 0; i < intensities.length; i++){
    k_arr.push(intensities[i]*2/FWHM/Math.PI);
    var lorentzian = lorentz(x0_arr[i], gamma, k_arr[i], x);
    lorentzians.push(lorentzian);
    peaks.push(Math.max.apply(Math, lorentzian));
  }
   for (let i = 0; i < x.length; i++){
    summ = 0;
    for (let j = 0; j < intensities.length; j++){
      summ = summ + lorentzians[j][i];
    }
    curve.push(summ);
  }
  return {
    curve: curve,
    peaks: peaks
  };
}

function do_fitting(plot_data){
  var two_thetas = plot_data.peaks_positions;
  var intensities = plot_data.intensities;
  var FWHM = plot_data.FWHM; 
  var th_range = plot_data.angular_range;
  var N = plot_data.number_of_points; 
  var fit_type = plot_data.fit_type;
  var x = makeArr(th_range[0], th_range[1], N);
  if (fit_type == "gauss"){
    var fit = do_gauss_fit(two_thetas, intensities, FWHM, x);
  } else if (fit_type == "lorentz"){
    var fit = do_lorentz_fit(two_thetas, intensities, FWHM, x);
  } else {
    console.log("Fit type not defined!");
    return -1;
  }
    
  var curve = fit.curve;
  var peaks = fit.peaks;
  //console.log(peaks);
  return {
    x: x,
    curve: curve,
    peaks: peaks
  };
}

function extract_hkl(plot_data){
  //var hkl_arr = plot_data.hkls;
  var hkl_list = [];
  for (let i = 0; i < plot_data.hkls.length; i++){
  hkl_list.push(plot_data.hkls[i][0]['hkl'].join(''));
  }
  return hkl_list;
}
/*
ReactDOM.render(
  React.createElement(Plot, {
    data: [
      {
        type: 'scatter',
        mode: 'lines+points',
        x: do_fitting([
        25.034468407912936,
        32.54037579099055,
        35.81822846321685,
        38.62933772456514,
        42.78393539019354,
        46.58684600761733,
        51.37551444708492,
        53.69534928125712,
        53.78268498501893,
        61.03891884694267,
        62.06593191380071,
        66.08289906116373,
        66.3138024898753,
        68.15787193697064,
        69.01436569536304,
        69.16513853628331,
        69.9034738701512,
        75.90616205930202,
        76.58206981979266,
        79.45963988251353,
        81.11333574547245,
        81.18460595420731,
        82.83058159610803,
        85.55379280819166,
        87.328059964537,
        88.23174022070799,
        88.58398426233413
        ],
        [
        41.39800704842205,
        99.99999999999999,
        0.013618127419447216,
        22.98532998096873,
        16.716848656381412,
        21.58352120426779,
        12.053505083969469,
        32.07964599637827,
        20.097478972193933,
        1.8294197313698937,
        14.981756918091309,
        12.051782135580524,
        3.128525847037712,
        4.875540401329509,
        1.1070646756602098,
        2.464574287528835,
        12.042397112164613,
        3.957473259314205,
        0.7400472350463889,
        3.74400635494971,
        1.4691522781404884,
        6.5283526689511975,
        2.549072409478307,
        0.3523106204816415,
        0.053172259039800794,
        2.223472547556988,
        4.065590767386589
    ],
        0.4, [5,90], 1000, "gauss").x,
        y: do_fitting(
        [
        25.034468407912936,
        32.54037579099055,
        35.81822846321685,
        38.62933772456514,
        42.78393539019354,
        46.58684600761733,
        51.37551444708492,
        53.69534928125712,
        53.78268498501893,
        61.03891884694267,
        62.06593191380071,
        66.08289906116373,
        66.3138024898753,
        68.15787193697064,
        69.01436569536304,
        69.16513853628331,
        69.9034738701512,
        75.90616205930202,
        76.58206981979266,
        79.45963988251353,
        81.11333574547245,
        81.18460595420731,
        82.83058159610803,
        85.55379280819166,
        87.328059964537,
        88.23174022070799,
        88.58398426233413
        ], [
        41.39800704842205,
        99.99999999999999,
        0.013618127419447216,
        22.98532998096873,
        16.716848656381412,
        21.58352120426779,
        12.053505083969469,
        32.07964599637827,
        20.097478972193933,
        1.8294197313698937,
        14.981756918091309,
        12.051782135580524,
        3.128525847037712,
        4.875540401329509,
        1.1070646756602098,
        2.464574287528835,
        12.042397112164613,
        3.957473259314205,
        0.7400472350463889,
        3.74400635494971,
        1.4691522781404884,
        6.5283526689511975,
        2.549072409478307,
        0.3523106204816415,
        0.053172259039800794,
        2.223472547556988,
        4.065590767386589
        ],
        0.4, [5,90], 1000, "gauss").curve,
        marker: {color: 'red'},
        hoverinfo: "none"
      },
      {
        type: 'scatter',
        mode: 'markers',
        marker: {color: 'red'},
        marker: { size: 10 },
        x: [
        25.034468407912936,
        32.54037579099055,
        35.81822846321685,
        38.62933772456514,
        42.78393539019354,
        46.58684600761733,
        51.37551444708492,
        53.69534928125712,
        53.78268498501893,
        61.03891884694267,
        62.06593191380071,
        66.08289906116373,
        66.3138024898753,
        68.15787193697064,
        69.01436569536304,
        69.16513853628331,
        69.9034738701512,
        75.90616205930202,
        76.58206981979266,
        79.45963988251353,
        81.11333574547245,
        81.18460595420731,
        82.83058159610803,
        85.55379280819166,
        87.328059964537,
        88.23174022070799,
        88.58398426233413
    ],
        y: [
        94.6370039944947,
        231.8693336191055,
        0.031815550737843264,
        53.58271989929118,
        39.235289497537075,
        50.34906760450437,
        28.30036089634284,
        74.4183646779022,
        46.52112486795,
        4.220280300577189,
        34.77124657681465,
        28.271836622742516,
        7.214014395798278,
        11.32986501915937,
        2.5587871478096123,
        5.776192788466362,
        28.15044303390567,
        9.147928711685184,
        1.7185751512674445,
        8.777338852711939,
        3.365989463184586,
        15.037942060951098,
        5.935497577402166,
        0.8206588335496883,
        0.12235950260673714,
        5.191063680496535,
        9.396419653715425
    ],
        hovertemplate: 'hkl: <b>%{text}</b><extra></extra>',
        text: ['110', '112', '10-1', '002', '211', '1-10', '212', '210', '1-11', '222', '200', '220', '213', '21-1', '103', '11-2',
        '322','311','2-10', '321', '2-11', '323', '310', '2-1-1', '114', '10-3', '224', '20-2', '313', '320', '2-12','214','1-13',
        '21-2', '301', '332', '004', '324', '31-1', '2-1-2', '204', '22-2', '334', '330', '30-1', '314', '32-1', '422', '2-20', 
        '423', '421', '2-21', '412', '432', '3-11', '411', '433', '3-10', '215', '1-14', '21-3']
      }
    ],
    layout: {
      width: 660,
      height: 480,
      title: 'Si_Cu_Ka_fit_gauss',
      showlegend: false,
      xaxis: {title: "2\u03F4" + ", degrees"},
      yaxis: {title: "Intensity, a.u."}
    }
  }),
  document.getElementById('root')
);

function gaussian(a, b, c, x){
  //var x = makeArr(x_range[0], x_range[1], N);
  var y = [];
  for (let i = 0; i < x.length; i++){
    y.push(a*Math.exp(-Math.pow((x[i]-b)/c,2)/2)); 
  }
  return y;
}

function lorentz(x0, gamma, k, x){
  //var x = makeArr(x_range[0], x_range[1], N);
  var y = [];
  for (let i = 0; i < x.length; i++){
    y.push(k*Math.pow(gamma, 2)/(Math.pow(gamma, 2) + Math.pow((x[i] - x0), 2))); 
  }
  return y;
}

function makeArr(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
}

function do_gauss_fit(two_thetas, intensities, FWHM, x){
  var a_arr = [];
  var b_arr = two_thetas.slice();
  var c = FWHM/2/Math.pow(2*Math.log(2),0.5);
  var gaussians = [];
  var peaks = [];
  var curve = [];
  var summ = 0;
  for (let i = 0; i < intensities.length; i++){
    
    a_arr.push(2*intensities[i]*Math.pow(Math.log(2),0.5)/FWHM/Math.pow(Math.PI, 0.5)); 
    var gauss = gaussian(a_arr[i], b_arr[i], c, x);
    gaussians.push(gauss);
    peaks.push(Math.max(gauss));
  }
  for (let i = 0; i < x.length; i++){
    summ = 0;
    for (let j = 0; j < intensities.length; j++){
      summ = summ + gaussians[j][i];
    }
    curve.push(summ);
  }
    return {
    curve: curve,
    peaks: peaks
  };
}

function do_lorentz_fit(two_thetas, intensities, FWHM, x){
  var x0_arr = two_thetas.slice();
  var gamma = FWHM/2;
  var k_arr = [];
  var lorentzians = [];
  var peaks = [];
  var summ = 0;
  var curve = [];
  
  for (let i = 0; i < intensities.length; i++){
    k_arr.push(intensities[i]*2/FWHM/Math.PI);
    var lorentzian = lorentz(x0_arr[i], gamma, k_arr[i], x);
    lorentzians.push(lorentzian);
    peaks.push(Math.max(lorentzian));
  }
   for (let i = 0; i < x.length; i++){
    summ = 0;
    for (let j = 0; j < intensities.length; j++){
      summ = summ + lorentzians[j][i];
    }
    curve.push(summ);
  }
  return {
    curve: curve,
    peaks: peaks
  };
}

function do_fitting(two_thetas, intensities, FWHM, th_range, N, fit_type){
  var x = makeArr(th_range[0], th_range[1], N);
  if (fit_type == "gauss"){
    var fit = do_gauss_fit(two_thetas, intensities, FWHM, x);
  } else if (fit_type == "lorentz"){
    var fit = do_lorentz_fit(two_thetas, intensities, FWHM, x);
  } else {
    console.log("Fit type not defined!");
    return -1;
  }
    
  var curve = fit.curve;
  var peaks = fit.peaks;
  return {
    x: x,
    curve: curve,
    peaks: peaks
  };
}*/

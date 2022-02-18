import React, { Component } from 'react'
import Plot from 'react-plotly.js';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import RangeSlider from 'react-bootstrap-range-slider';
import '../index.css';

class XrdPlot extends Component {
  constructor(props){
    super(props);
    this.doFitting = this.doFitting.bind(this);
    this.handleChangeFWHM = this.handleChangeFWHM.bind(this);
    this.handleClickGFit = this.handleClickGFit.bind(this);
    this.handleClickLFit = this.handleClickLFit.bind(this);
    this.handleClickWavelength = this.handleClickWavelength.bind(this);
    this.handleChangeCurve = this.handleChangeCurve.bind(this);
    this.handleChangeHist = this.handleChangeHist.bind(this);
    this.construct_data_plt = this.construct_data_plt.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      data: [],
      wavelength: null,
      wavelengths_list: [],
      xrdPattern: [],
      hkls: [],
      angular_range: [],
      FWHM: null,
      fit_type: null,
      show_curve: true,
      show_hist: true,
    };    
  }
  componentDidMount(){
    //console.log("Xrd componentDidMount was called!")
    const wavelength = this.props.wavelength;
    const mc3d_id = this.props.mc3d_id;
    fetch(`../../../mc3d-pbe/${mc3d_id.replaceAll("/","-")}.json`, { headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
    .then(res => res.json())
    .then(
      r => {
        this.setState({
        isLoaded: true,
        data: r.data,
        wavelengths_list: Object.keys(r.data),
        wavelength: Object.keys(r.data)[0],
        angular_range: r.data[wavelength].angular_range,
        xrdPattern: {peaks_positions:r.data[wavelength].peaks_positions,intensities: r.data[wavelength].intensities},
        hkls: r.data[wavelength].hkls,
        fit_type: "Gaussian",
        FWHM: 0.4,
    });
  },(error) => {
    this.setState({
      isLoaded: true,
      error
    });
  }
);
  }
  componentDidUpdate(prevProps) {
    //console.log("PlotXRD componentDidUpdate was called!");
    if (this.props.mc3d_id !== prevProps.mc3d_id) {
      //console.log("Inside componentDidUpdate condition");
      const wavelength = this.props.wavelength;
      const mc3d_id = this.props.mc3d_id;
    fetch(`../../../mc3d-pbe/${mc3d_id.replaceAll("/","-")}.json`, { headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
    .then(res => res.json())
    .then(
      r => {
        this.setState({
        isLoaded: true,
        data: r.data,
        wavelengths_list: Object.keys(r.data),
        wavelength: Object.keys(r.data)[0],
        angular_range: r.data[wavelength].angular_range,
        xrdPattern: {peaks_positions:r.data[wavelength].peaks_positions,intensities: r.data[wavelength].intensities},
        hkls: r.data[wavelength].hkls,
        fit_type: "Gaussian",
        FWHM: 0.4,
    });
  },(error) => {
    this.setState({
      isLoaded: true,
      error
    });
  }
);
    }
  }

  handleChangeFWHM(e){
    if (this.state.FWHM !== e.target.value){
    this.setState({FWHM: e.target.value});
    }
  }
  handleClickGFit(){
    if (this.state.fit_type !== "Gaussian"){
    this.setState({fit_type: "Gaussian"});
    }
  }
  handleClickLFit(){
    if (this.state.fit_type !== "Lorentzian"){
      this.setState({fit_type: "Lorentzian"});
    }
  }

  handleClickWavelength(wl){
    if (this.state.wavelength !== wl){
      const data = this.state.data;
      this.setState({
        wavelength: wl,
        angular_range: data[wl].angular_range,
        xrdPattern: {peaks_positions:data[wl].peaks_positions,intensities: data[wl].intensities},
        hkls: data[wl].hkls,
      });
    }
    
  }

  doFitting(){
    var two_thetas = this.state.xrdPattern.peaks_positions;
    var intensities = this.state.xrdPattern.intensities;
    var FWHM = this.state.FWHM; 
    var th_range = this.state.angular_range;
    
    var N = 1000; 
    var fit_type = this.state.fit_type;
    var x = makeArr(th_range[0], th_range[1], N);

    if (fit_type === "Gaussian"){
      var fit = do_gauss_fit(two_thetas, intensities, FWHM, x);
    } else if (fit_type === "Lorentzian"){
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
  }

  handleChangeCurve(evt){
    this.setState({ 
      show_curve: evt.target.checked,
    });
  }
  handleChangeHist(evt){
    this.setState({ 
      show_hist: evt.target.checked, 
    });
  }

construct_data_plt(){
  var fit = this.doFitting();
  var result = [];
  const intensities = this.state.xrdPattern.intensities;
  
  var curve_dict = {
    type: 'scatter',
    mode: 'lines+points',
    x: fit.x,
    y: fit.curve,
    marker: {color: 'red', size: 0.5},
    line: {width: 1},
    hoverinfo: "none"
  };
  var scatter_dict = {
    type: 'scatter',
    mode: 'markers',
    marker: {color: 'red'},
    marker: { size: 2 },
    x: this.state.xrdPattern.peaks_positions,
    y: fit.peaks,
    hovertemplate: 'hkl: <b>%{text}</b><extra></extra>',
    text: this.state.hkls
    };    const xrd_pattern = this.state.xrdPattern;
    const hkls = this.state.hkls;
  
  var hist_dict = {
    type: 'bar',
    x: this.state.xrdPattern.peaks_positions,
    y: intensities,
    hovertemplate: 'hkl: <b>%{text}</b><extra></extra>',
    text: this.state.hkls,
    width: 0.5,
    marker: {
      color: 'black', 
      opacity: 0.7,
    }
    };

  if (this.state.show_curve){
    result.push(curve_dict);
  }
  if (this.state.show_hist){
    result.push(hist_dict);
  }
  return result;
}

  render() {
    let isLoaded = this.state.isLoaded;
    let error = this.state.error;
    const wavelength = this.state.wavelength;
    const FWHM = this.state.FWHM;
    //const data = {...this.props.xrdPattern, ...this.props.xrdParameters};
    const wavelengths_list = this.state.wavelengths_list;
    const data_plt = this.construct_data_plt();

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>loading...</div>;
    } else { 
      
    return (
      <div>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {conv_wl_name(wavelength)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
          {wavelengths_list.map((wl)=>(
          <Dropdown.Item eventKey={wl} onClick= {()=>this.handleClickWavelength(wl)}>{ conv_wl_name(wl)} </Dropdown.Item>
          ),)
          }
          </Dropdown.Menu>
        </Dropdown>
      <Dropdown className="white-background">
      <Dropdown.Toggle variant="success" id="dropdown-basic" >
        {this.state.fit_type}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick= {this.handleClickGFit}>Gaussian </Dropdown.Item>
          <Dropdown.Item onClick= {this.handleClickLFit}>Lorentzian</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Form>
      <Form.Label>FWHM</Form.Label>
      <Form.Group as={Row}>
        <Col xs="3">
          <RangeSlider
            value={FWHM}
            min="0" max = "2" step="0.05"
            onChange={this.handleChangeFWHM}
            hideLabels={true}
          />
        </Col>
        {<Col xs="2">
          <Form.Control value={FWHM}/>
    </Col>}
      </Form.Group>
    </Form>
      {/*<Form.Label>FWHM: {FWHM}</Form.Label>
      <Form.Range value={FWHM} min="0" max = "1" step="0.05" onChange={this.handleChangeFWHM} />
      
      <fieldset>
        <legend>Enter FWHM:</legend>
        <input value={FWHM} onChange={this.handleChangeFWHM} /> 
      </fieldset>*/}
      <Form>
  
    <div key={`inline-checkbox`} className="mb-3">
      <Form.Check
        inline
        checked={this.state.show_curve}
        onChange={this.handleChangeCurve}
        label="Show broadened curve"
        name="group1"
        type='checkbox'
        id={`inline-checkbox-1`}
      />
      <Form.Check
        inline
        checked={this.state.show_hist}
        onChange={this.handleChangeHist}
        label="Show histogram"
        name="group1"
        type='checkbox'
        id={`inline-checkbox-2`}
      />
    </div>
  
</Form>

      <Plot
        data=
        {data_plt}
        layout = { {
        width: 660,
        height: 480,
        showlegend: false,
        xaxis: {title: "2\u03F4" + ", degrees"},
        yaxis: {title: "Intensity, a.u."}
      } }
      />
      </div>

    );
    }
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

function do_fitting(pattern_data, N=1000){
  var two_thetas = pattern_data.peaks_positions;
  var intensities = pattern_data.intensities;
  var FWHM = pattern_data.FWHM; 
  var th_range = pattern_data.angular_range;
  
  //var N = pattern_data.number_of_points; 
  var fit_type = pattern_data.fit_type;
  var x = makeArr(th_range[0], th_range[1], N);
  if (fit_type == "Gaussian"){
    var fit = do_gauss_fit(two_thetas, intensities, FWHM, x);
  } else if (fit_type == "Lorentzian"){
    var fit = do_lorentz_fit(two_thetas, intensities, FWHM, x);
  } else {
    console.log("Fit type not defined!");
    return -1;
  }
    
  var curve = fit.curve;
  var peaks = fit.peaks;
  console.log("th_range= ")
  console.log(th_range);
  console.log(N);
  return {
    x: x,
    curve: curve,
    peaks: peaks
  };
}
function extract_hkls(plot_data_hkls){
  //var hkl_arr = plot_data.hkls;
  var hkl_list = [];
  for (let i = 0; i < plot_data_hkls.length; i++){
  hkl_list.push(plot_data_hkls[i][0]['hkl'].join(''));
  }
  return hkl_list;
}

function conv_wl_name(name){
  let result = name.slice(0,-1);
  if (name.charAt(name.length-1)==='a'){
    result = result.concat("\u03B1")
  }
  else if (name.charAt(name.length-1)==='b'){
    result = result.concat("\u03B2")
  }
  else {
    console.log("wavelength name conversion failed!");
    result = name;
  }
  return result;
  }
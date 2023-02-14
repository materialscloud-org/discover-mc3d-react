import React, { Component } from 'react';
import XrdPlot from './xrd/plot_xrd';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Plot from 'react-plotly.js';
import { useParams, useNavigate } from "react-router-dom";
//import './index.css';
//import './mcloud_theme.css';
//import './theme.css';


class Visualizer extends Component{
  /*
  Test component to visualize the structure, renders plotly 3D plot. Takes atomic coordinates as a prop.
  */
  render(){
    const Atomic_coords = this.props.Coords['data']['attributes']['sites']; 
    var data = {
      x: Object.keys(Atomic_coords).map(i => Atomic_coords[i].position[0]),
      y: Object.keys(Atomic_coords).map(i => Atomic_coords[i].position[1]),
      z: Object.keys(Atomic_coords).map(i => Atomic_coords[i].position[2]),
      mode: 'markers',
	    marker: {    
	    	size: 12,
	    	line: {
	    	color: 'rgba(217, 217, 217, 0.14)',
	    	width: 0.5},
	    	opacity: 0.8},        
	    type: 'scatter3d'
    };
    var layout = {margin: {
      l: 0,   
      r: 0,   
      b: 0,
      t: 0
      }}; 
      //newPlot('myDiv', data, layout) 
      //<Plot data= {data}  layout = {layout}/> 
    return (
        <div>
          <h2> Visualizer</h2>
          <div> Coordinates: <span className="blue">{this.props.CoordsBox}</span></div>
          <Plot
             data={[data,]}
             layout={ layout }
            />
        </div>);

    }
}

class InfoBox extends Component{
/*This component renders info, source and properties panels. Take data for each panel as props 
Can be converted to a function*/
    render() {
      const info = this.props.info;
      const source = this.props.source;
      const properties = this.props.properties;
      console.log("Infobox info:");
      console.log(info);
      return ( 
      <div>
        <div className="panel-group compound-properties properties-3dd">
          <div className="panel panel-default">
            <div className="panel-heading" style={{paddingBottom: '7px', paddingTop: '4px'}}>
              <h3 className="panel-title"> Info </h3>
            </div>
              <div className="panel-body">
              {Object.keys(info).map(i => {
                var value = info[i];
                if (i === "formula"){
                  value = format_compound_name(value);
                } 
                return(
                <div className="property">
                <div className="key">{format_info_property(i)}: </div>
                <div className="value"> <span>{value}</span> </div>
              </div>
                )})
                }
            </div>
          </div>
        </div>
        <div className="panel-group compound-properties properties-3dd">
        <div className="panel panel-default">
            <div className="panel-heading" style={{paddingBottom: '7px', paddingTop: '4px'}}>
              <h3 className="panel-title"> Source </h3>
            </div>
              <div className="panel-body">
              {Object.keys(source).map(i => {  
                //console.log("source[i]");
                //console.log(source[i]);
                return(
                <div className="property">
                <div className="key">{source[i]['source_database']} ID: </div>
                <div className="value"> <span>{source[i]['source_id']}</span> </div>
              </div>
                )})
                }
            </div>
          </div>
        </div>
        <div className="panel-group compound-properties properties-3dd">
        <div className="panel panel-default">
            <div className="panel-heading" style={{paddingBottom: '7px', paddingTop: '4px'}}>
              <h3 className="panel-title"> Properties </h3>
            </div>
              <div className="panel-body">
              <div className="property">
                  <div className="key"> Total energy: </div>
                  <div className="value"> <span>{properties.total_energy.value} eV/cell</span> </div>
              </div>
              <div className="property">
                  <div className="key"> Total magnetization: </div>
                  <div className="value"> <span>{check_magnetization("total_magnetization", properties)} </span> </div>
              </div>
              <div className="property">
                  <div className="key"> Absolute magnetization: </div>
                  <div className="value"> <span>{check_magnetization("absolute_magnetization", properties)}</span> </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    }
   
}
class CellBox extends Component{
  /* This component renders table with unit cell coordinates. Takes cell vectors as a prop.
  Can be converted to a function*/
  render(){
    const Cell_coords = this.props.CoordsBox['data']['attributes']['cell'];
    return (
      <div>
        <div className="panel-heading">
      <h3 className="panel-title"> 3D structure cell </h3>
      </div>
        <Table className="table attribute-table numbers-font-family">
          <thead >
            <tr>
              <th></th>
              <th>x</th>
              <th>y</th>
              <th>z</th>
            </tr>
          </thead>
          <tbody>
          {
            
            Object.keys(Cell_coords).map(i => { return(
            <tr key={i.toString()}>
              <td key={`${i.toString()}v${parseInt(i)+1}`}>v{parseInt(i)+1}</td>
              <td key={`${i.toString()}x`}>{Cell_coords[i][0]}</td>
              <td key={`${i.toString()}y`}>{Cell_coords[i][1]}</td>
              <td key={`${i.toString()}z`}>{Cell_coords[i][2]}</td>
            </tr>);})
            }
          </tbody>
          </Table>
          </div>

    );
  }
}
class AtomBox extends Component{
  /* This component renders table with atomic coordinates. Takes them as a prop.
  Can be converted to a function*/
  render(){
    const Atomic_coords = this.props.CoordsBox['data']['attributes']['sites'];
    return(
      <div>
        <div className="panel-heading">
        <h3 className="panel-title"> 3D structure atomic coordinates </h3>
        </div>
            <Table className="table attribute-table numbers-font-family">
              <thead >
                <tr>
                  <th>Kind label</th>
                  <th>x</th>
                  <th>y</th>
                  <th>z</th>
                </tr>
              </thead>
              <tbody>
              {Object.keys(Atomic_coords).map(i => { return(
                <tr key={i.toString()}>
                  <td key={`${i.toString()}_kind_name`}>{Atomic_coords[i].kind_name}</td>
                  <td key={`${i.toString()}x`}>{Atomic_coords[i].position[0]}</td>
                  <td key={`${i.toString()}y`}>{Atomic_coords[i].position[1]}</td>
                  <td key={`${i.toString()}z`}>{Atomic_coords[i].position[2]}</td>
                </tr>)})
                }
              </tbody>
            </Table>
      </div>
    );
  }
}

class DetailPage extends Component{
  /* Main component which renders the whole page for a given structure. 
  Props: page_details_link to information about aiida_rest_endpoint and compounds url, compound_name, id and navigate function to enable routing between different structures*/
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.handleClickSpacegroups = this.handleClickSpacegroups.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      aiida_rest_endpoint: null,
      compounds_url: null,
      info: [],
      coords: [],
      wavelength: 'CuKa',
      spacegroup_international: null,
      spacegroups_arr: [],
      ids_arr: [],
    };
  }
fetchData(compound, id, compounds_url, aiida_rest_endpoint){
  console.log(`${compounds_url}/${compound}`);
    fetch(`${compounds_url}/${compound}`).then(res => res.json())
    .then(res => {
      const spacegroups_arr = res.data[compound].map((stru)=>stru.info.spacegroup_international);
      const ids_arr = res.data[compound].map((stru)=>stru.info.mc3d_id);
      const uuid = res.data[compound][ids_arr.indexOf(id)].uuid_structure;
      this.setState({
        info: res,
        spacegroup_international: res.data[compound][ids_arr.indexOf(id)].info.spacegroup_international,
        spacegroups_arr: spacegroups_arr,
        ids_arr: ids_arr,
      });
      return fetch(`${aiida_rest_endpoint}/nodes/${uuid}/contents/attributes`).then(res => res.json());
    }).then(
      r => {
        this.setState({
          isLoaded: true,
          coords: r,
        });
      },(error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  }


componentDidMount(){
const url = this.props.page_details_link;
const compound = this.props.compound_name;  
const id = this.props.id;    
fetch(url, { method: 'get' })
  .then(response => response.json())
  .then(data => {
    console.log("Inside componentDidMount");
    this.pageDetails = data;
    const compounds_url = data.data.compounds_url;
    const aiida_rest_endpoint = data.data.aiida_rest_endpoint;
    this.setState({compounds_url: compounds_url, aiida_rest_endpoint: data.data.aiida_rest_endpoint})
    this.fetchData(compound, id, compounds_url, aiida_rest_endpoint);
  }
);
  }

 
componentDidUpdate(prevProps) {
  console.log("componentDidUpdate was called!");
  if (this.props.compound_name !== prevProps.compound_name || this.props.id !== prevProps.id) {
    console.log("Inside componentDidUpdate condition");
    this.setState({
      error: null,
      isLoaded: false,
      info: [],
      coords: [],
      wavelength: 'CuKa',
      spacegroup_international: null,
      spacegroups_arr: [],
      ids_arr: [],
    });
    this.fetchData(this.props.compound_name, this.props.id, this.state.compounds_url, this.state.aiida_rest_endpoint );
  }
}


handleClickSpacegroups(sgi){
  if (this.state.spacegroup_international !== sgi){
    const id = this.state.ids_arr[this.state.spacegroups_arr.indexOf(sgi)];
    this.props.navigate(`/details/${this.props.compound_name}/${id}`);
    //this.setState({spacegroup_international: sgi});
    //fetch(`${this.state.aiida_rest_endpoint}/nodes/${this.state.info.data[this.props.compound_name][this.state.spacegroups_arr.indexOf(sgi)].uuid_structure}/contents/attributes`)
    //.then(res => res.json()).then(
      //r => { this.setState({coords:r})}
        //)
  }
  
}
render() {

    let compound = this.props.compound_name;
    let id = this.props.id;
    let isLoaded = this.state.isLoaded;
    const info = this.state.info;
    const coords = this.state.coords;
    const error = this.state.error;
    const wavelength = this.state.wavelength;
    const spacegroups_arr = this.state.spacegroups_arr;
    const spacegroup_international = this.state.spacegroup_international;
    const curr_spacegroup_index = this.state.spacegroups_arr.indexOf(spacegroup_international);
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>loading...</div>;
    } else {
        return (
        <div className="details-page" >
        <div className="mcloud-wrapper">
        
        <div className="mcloud-container">
        <div className="mcloud-page-container">
        <div className="mcloud-page-content panel panel-default">
        <div className="discover-main-container">
        <div className="structures2d" id="topLocation">
          <div className="page-subtitle">
          <h2><span compile="compoundDisplayName">Compound: {format_compound_name(this.props.compound_name)}</span></h2>
          </div>
          <div className="selection-box">
            <h3 className="title">Available structures for this formula: </h3>
            <div className="dropdown-select">
            <Dropdown >
            <Dropdown.Toggle variant="success" id="dropdown-basic">
            {spacegroup_international}
              </Dropdown.Toggle>
              
                <Dropdown.Menu>
                       {spacegroups_arr.map((stru)=>(
                       <Dropdown.Item eventKey={stru} onClick= {()=>this.handleClickSpacegroups(stru)}>{ stru} </Dropdown.Item>

                       ),)
                       }
                     </Dropdown.Menu>
            </Dropdown>
            </div>
          </div>
          <Container fluid>
            
            <Row>
              <Col sm="6" md="3">
                {/*<Visualizer Coords={coords}/>
                <div className="panel-header">
              <h3 className="panel-title">Visualizer</h3>
            </div>*/}
              <InfoBox info = {info['data'][compound][curr_spacegroup_index]['info']} 
                source = {info['data'][compound][curr_spacegroup_index]['source']} 
                properties = {info['data'][compound][curr_spacegroup_index]['properties']} />
              
                   
                  
              </Col>
              <Col sm="6" md="auto">
              <div className="panel-header">
              <h3 className="panel-title">Simulated X-Ray diffraction pattern</h3>
              </div>
              <XrdPlot mc3d_id = {info['data'][compound][curr_spacegroup_index]['info']["mc3d_id"]} 
                wavelength = {wavelength}/>  
              </Col>
            <Col sm="6" md="auto">
            <div className="structure-attribute-container-height structure-attributes-3dd">
            <CellBox CoordsBox={coords}></CellBox>
            <AtomBox CoordsBox={coords}></AtomBox>

            </div>
            </Col>
            
            
            
            </Row>
            
          </Container>
          </div>
          </div>
          </div>
          </div>
          </div>
          </div>
          
          
          
        </div>  
    ); } 
    }

}
//
export default function ThreeDimDataBase() {
  /* Function that returns DetailPage according to the parameters in the link: "details/:compound/:id/:id_pp"*/
    const info_page_link = "https://dev-www.materialscloud.org/mcloud/api/v2/discover/mc3d/info";
    //const wavelengths_list = ['CuKa', 'MoKa', 'CrKa', 'FeKa', 'CoKa', 'AgKa'];
    let params = useParams();
    let compound = params.compound;
    let id = `${params.id}/${params.id_pp}`;
    let navigate = useNavigate();
    //console.log(`Inside ThreeDimDataBase function! compound name is ${compound}`);
    return(
    <div className="3dcd">
        <div className="3dcd-details_page">

            <DetailPage 
            page_details_link={info_page_link}
            compound_name={compound}
            id={id}
            navigate={navigate}
          /> 
          </div>
      </div>
    );

    }

    function format_compound_name(name){
      var myRe = /(\d+)/g;
      var list = name.split(myRe);
      var result = [];
      for (var item of list){
      if (myRe.test(item)){
        result.push(<sub>{item}</sub>);
      }
      else {
        result.push(item)
      }
      }
      return result;
    }

    function format_info_property(prop_name){
      var result = null;
      if (prop_name === "mc3d_id"){
        result = prop_name.toUpperCase().replace("_", "-");
      }
      else{
        result = prop_name.charAt(0).toUpperCase() + prop_name.slice(1);
        result = result.replace("_", " ");
      }
      return result;
    }

    function check_magnetization(prop_name, properties_dict){
      if (Object.keys(properties_dict).includes(prop_name)){
        return [properties_dict[prop_name].value, " μB/cell"];
      }
      else{
        return "N/A";
      }
    }

    function round_number(number_string, precision){
      var result = Math.round((parseFloat(number_string) + Number.EPSILON) * 10**precision) / 10**precision;
      return result;
    }

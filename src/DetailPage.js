import React, { Component } from 'react';
import XrdPlot from './xrd/plot_xrd';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Plot from 'react-plotly.js';
import Popper from 'react-popper';
import { useParams } from "react-router-dom";
import './index.css';
import './mcloud_theme.css';
import './theme.css';


/*
class Title extends Component{
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu


// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it


render() { 
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));
const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);
return(
  <Dropdown>
    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
      Custom toggle
    </Dropdown.Toggle>

    <Dropdown.Menu as={CustomMenu}>
      <Dropdown.Item eventKey="1">Red</Dropdown.Item>
      <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
      <Dropdown.Item eventKey="3" active>Orange</Dropdown.Item>
      <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>)
}
}*/

class Title_dropdown extends Component{
  renderDetailPage(i){
    return(
      <DetailPage
      page_details_link={this.props.info_page_link}
      compound={this.props.compound_list[i]}
      compound_list={this.props.compound_list}
      />
    )
  }
  render(){
  let curr_compound = this.props.curr_compound;
  let compound_list = this.props.compound_list;
  let info_page_link = this.props.info_page_link;
  return(
  <DropdownButton id="dropdown-basic-button" title={curr_compound}>
  <Dropdown.Item
  href={"/" + compound_list[0]}

  onClick={this.renderDetailPage(0)}
  >{compound_list[0]}
  </Dropdown.Item>
  <Dropdown.Item href={"/" + compound_list[1]}
  onClick={()=>{return <DetailPage 
    page_details_link={info_page_link}
    compound={compound_list[1]}
    compound_list={compound_list}
    />}}
  >{compound_list[1]}</Dropdown.Item>
  <Dropdown.Item href={"/" + compound_list[2]}
  onClick={()=>{return <DetailPage 
    page_details_link={info_page_link}
    compound={compound_list[2]}
    compound_list={compound_list}
    />}}
  >{compound_list[2]}</Dropdown.Item>
</DropdownButton>
  );
  }
}

class Visualizer extends Component{
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

    render() {
      const info = this.props.info;
      const source = this.props.source;
      const properties = this.props.properties;
      return ( 
      <div>
        <div className="panel-group compound-properties properties-3dd">
          <div className="panel panel-default">
            <div className="panel-heading" style={{paddingBottom: '7px', paddingTop: '4px'}}>
              <h3 className="panel-title"> Info </h3>
            </div>
              <div className="panel-body">
              <div className="property">
                  <div className="key">MC3D-ID: </div>
                  <div className="value"> <span>{info.mc3d_id}</span> </div>
                </div>
                <div className="property">
                  <div className="key">Formula: </div>
                  <div className="value"> <span>{info.formula}</span> </div>
                </div>
              <div className="property">
                <div className="key">Spacegroup international: </div>
                <div className="value"><span>{info.spacegroup_international}</span></div>
              </div>
              <div className="property">
                <div className="key">Spacegroup number: </div>
                <div className="value"><span>{info.spacegroup_number}</span></div>
              </div>
              <div className="property">
                <div className="key">Bravais lattice: </div>
                <div className="value"><span>{info.bravais_lattice}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="panel-group compound-properties properties-3dd">
        <div className="panel panel-default">
            <div className="panel-heading" style={{paddingBottom: '7px', paddingTop: '4px'}}>
              <h3 className="panel-title"> Source </h3>
            </div>
              <div className="panel-body">
              <div className="property">
                  <div className="key">{source[0]['source_database']} ID: </div>
                  <div className="value"> <span>{source[0]['source_id']}</span> </div>
              </div>
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
                  <div className="value"> <span>{properties.total_energy.value}</span> </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    }
   
}
class CellBox extends Component{
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
class CoordsBox extends Component{
  
  render(){
    const Cell_coords = this.props.CoordsBox['data']['attributes']['cell'];
    const Atomic_coords = this.props.CoordsBox['data']['attributes']['sites'];
    //console.log('!');
    //console.log(Cell_coords);   
        return (
        <div>
          <div>
          <h3> 3D structure cell </h3>
            <Table striped bordered hover>
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
                <tr>
                  <td>v{parseInt(i)+1}</td>
                  <td>{Cell_coords[i][0]}</td>
                  <td>{Cell_coords[i][1]}</td>
                  <td>{Cell_coords[i][2]}</td>
                </tr>);})
                }
              </tbody>
            </Table>
            <h3> 3D structure atomic coordinates </h3>
            <Table striped bordered hover>
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
                <tr>
                  <td>{Atomic_coords[i].kind_name}</td>
                  <td>{Atomic_coords[i].position[0]}</td>
                  <td>{Atomic_coords[i].position[1]}</td>
                  <td>{Atomic_coords[i].position[2]}</td>
                </tr>)})
                }
              </tbody>
            </Table>
          </div>

          
        </div>
        );

    }

}
//<div>Coordinates: <span className="blue">{this.props.CoordsBox['3D_structure_atomic_coords'].a1.y}</span></div>

class DetailPage extends Component{
  
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.handleClickWavelength = this.handleClickWavelength.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      info: [],
      coords: [],
      wavelength: 'CuKa',
      //xrd_plot_params: {"fit_type": "gauss", "FWHM":0.4},
      //xrd_pattern:[],
      //page_details:[],
    };
  }
fetchData(compound, compounds_url, aiida_rest_endpoint){
    fetch(`${compounds_url}/${compound}`).then(res => res.json())
    .then(res => {
      const uuid = res.data[compound][0].uuid_structure;
      this.setState({
        info: res 
      });
      return fetch(`${aiida_rest_endpoint}/nodes/${uuid}/contents/attributes`).then(res => res.json());
    }).then(
      r => {
        console.log("Fetching coords result");
        console.log(r);
        this.setState({
          isLoaded: true,
          coords: r,
          //xrd_pattern: r[1],
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
    
fetch(url, { method: 'get' })
  .then(response => response.json()) // pass the data as promise to next then block
  .then(data => {
    console.log("Inside componentDidMount");
    console.log(data);
    this.pageDetails = data;
    const compounds_url = data.data.compounds_url;
    console.log(`compound url = ${compounds_url}/${compound}`);
    const aiida_rest_endpoint = data.data.aiida_rest_endpoint;
    this.fetchData(compound, compounds_url, aiida_rest_endpoint);
  }
);
  }
  /*
handleClick(i){
  const url = this.props.page_details_link;
  const compounds_url = this.state.page_details.data.compounds_url;
  console.log(`Inside handleClick ${i}!`)
  console.log(`${compounds_url}/${this.props.compound_list[i]}`)
  
  this.setState({
    error: null,
    //isLoaded: false,
    //info: [],
    //coords: [],
    //xrd_plot_params: {"fit_type": "gauss", "FWHM":0.4},
    //xrd_pattern:[],
    //page_details: []
  });
  const result = Promise.all([fetch(`${compounds_url}/${this.props.compound_list[i]}`).then(res => res.json()),
      fetch(this.props.compound_list[i]+"_CoordBox_correct.json", {
        headers: {
          'Content-Type': 'application/json', 
          'Accept': 'application/json'
        }
      }
      ).then(res => res.json()),
      fetch(`xrd_${this.props.compound_list[i]}_CuKa.json`, {
        headers: {
          'Content-Type': 'application/json', 
          'Accept': 'application/json'
        }
      }
      ).then(res => res.json())]); // make a 2nd request and return a promise
    
  console.log('fetching result:')
  console.log(result);
  console.log("comp_name: "+this.props.compound_list[i]);
  // I'm using the result const to show that you can continue to extend the chain from the returned promise
  result.then(r => {
    console.log("r[1]");
    console.log(r[1]);
    this.setState({
      isLoaded: true,
      info: r[0],
      coords: r[1],
      xrd_pattern: r[2],
      compound_name: this.props.compound_list[i]
    });
  }, (error) => {
    this.setState({
      isLoaded: true,
      error
    });
  }
  );
  //console.log
}
*/
 
componentDidUpdate(prevProps) {
  console.log("componentDidUpdate was called!");
  if (this.props.compound_name !== prevProps.compound_name) {
    
    this.setState({
      error: null,
      isLoaded: false,
      info: [],
      coords: [],
      wavelength: 'CuKa',
      //xrd_plot_params: {"fit_type": "gauss", "FWHM":0.4},
      //xrd_pattern:[],
    });
    this.fetchData(this.props.compound_name);
  }
}

handleClickWavelength(wl){
  if (this.state.wavelength !== wl){
    this.setState({wavelength: wl});
    console.log(wl);
  }
}
render() {

    let compound = this.props.compound_name;
    let isLoaded = this.state.isLoaded;
    const info = this.state.info;
    const coords = this.state.coords;
    //const xrd_pattern = this.state.xrd_pattern;
    //const xrd_params = this.state.xrd_plot_params;
    const error = this.state.error;
    const wavelengths_list = this.props.wavelengths_list;
    const wavelength = this.state.wavelength;
    //const info_page_link = this.props.page_details_link;
    console.log("render function info");
    console.log(`this.props.compound_name = ${compound}`);
    
    console.log(info);

    //console.log("compound_list[0]"+compound_list[0]);
    //this.handleClick(0);
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
          <h2>Compound: <span compile="compoundDisplayName">{this.props.compound_name}</span></h2>
          </div>
          <div className="selection-box">
            <h3 className="title">Available space groups for this formula: </h3>
            <div className="dropdown-select">
            <Dropdown >
            <Dropdown.Toggle variant="success" id="dropdown-basic">
            Pnma
              </Dropdown.Toggle>

              {/*<Dropdown.Menu>
                <Dropdown.Item onClick= {}> </Dropdown.Item>
                
              </Dropdown.Menu>*/}
            </Dropdown>
            </div>
          </div>
          <Container fluid>
            
            <Row>
              <Col sm="6" md="4">
                {/*<Visualizer Coords={coords}/>*/}
                <div className="panel-header">
              <h3 className="panel-title">Visualizer</h3>
              </div>
              <div className="panel-header">
              <h3 className="panel-title">Simulated X-Ray diffraction pattern</h3>
              </div>
                   <Dropdown>
                   <Dropdown.Toggle variant="success" id="dropdown-basic">
                     Select wavelength
                     </Dropdown.Toggle>

                     <Dropdown.Menu>
                       {wavelengths_list.map((wl)=>(
                       <Dropdown.Item eventKey={wl}>{ conv_wl_name(wl)} </Dropdown.Item>

                       ),)
                       }
                     </Dropdown.Menu>
                   </Dropdown>
                <XrdPlot compound = {compound} wavelength = {wavelength}/>    
              </Col>
              <Col sm="6" md="4">
                <InfoBox info = {info['data'][compound][0]['info']} source = {info['data'][compound][0]['source']} properties = {info['data'][compound][0]['properties']} />
              </Col>
            <Col sm="6" md="4">
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
  
  
    //console.log('!');
    //console.log(this.state.page_details);
    const info_page_link = "https://dev-www.materialscloud.org/mcloud/api/v2/discover/mc3d/info";
    const wavelengths_list = ['CuKa', 'MoKa', 'CrKa', 'FeKa', 'CoKa', 'AgKa'];
    //const compound= "Sb2Zr";
    let params = useParams();
    let compound = params.compound;
    console.log(`Inside ThreeDimDataBase function! compound name is ${compound}`);
    return(
    <div className="3dcd">
        <div className="3dcd-details_page">

            <DetailPage 
            page_details_link={info_page_link}
            compound_name={compound}
            wavelengths_list = {wavelengths_list}
          /> 
          </div>
      </div>
    );

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
/*                <h1>Compound: <span><Title_dropdown 
                                info_page_link={info_page_link}
                                compound_list={compound_list}
                                curr_compound={compound_list[0]}
                                
          /></span></h1>*/
//<Col><Visualizer CoordsBox={this.state.coords['data'][this.state.compound][0]}></Visualizer></Col>//
 //  export default  ThreeDimDataBase; 
   /*
   <DropdownButton id="dropdown-basic-button" title={compound}>
             <Dropdown.Item
             href={"/" + compound_list[0]}
             onClick={this.handleClick(0)}
             >{compound_list[0]}
             </Dropdown.Item>
             <Dropdown.Item 
             href={"/" + compound_list[1]}
             onClick={this.handleClick(1)}
            >{compound_list[1]}</Dropdown.Item>
          </DropdownButton>
   */
  /*
  <DropdownButton id="dropdown-basic-button" title={compound}>
 
  */
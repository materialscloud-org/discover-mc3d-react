import React, { Component } from 'react';
import XrdPlot from './xrd/plot_xrd';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Plot from 'react-plotly.js';
       
class Visualizer extends Component{
  render(){
    const Atomic_coords = this.props.Coords['3D_structure_atomic_coords'];
    var data = {
      x: Object.keys(Atomic_coords).map(i => Atomic_coords[i].x),
      y: Object.keys(Atomic_coords).map(i => Atomic_coords[i].y),
      z: Object.keys(Atomic_coords).map(i => Atomic_coords[i].z),
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
             data={[
               {
                 x: Object.keys(Atomic_coords).map(i => Atomic_coords[i].x),
                 y: Object.keys(Atomic_coords).map(i => Atomic_coords[i].y),
                 z: Object.keys(Atomic_coords).map(i => Atomic_coords[i].z),
                 type: 'scatter3d',
                 mode: 'markers',
                 marker: {size: 12,line: {color: 'rgba(217, 217, 217, 0.14)',width: 0.5}},
               },

             ]}

             layout={ {margin:{l:0,r:0,b:0,t:0 } } }

            />
          
          

          
        </div>);

    }
}

class InfoBox extends Component{

    render() {
      return ( 
      <div>
        <h3> Info </h3>
        <div>Formula: <span className="blue">{this.props.formula}</span></div>
        <div>Spacegroup international: <span className="blue">{this.props.spacegroupInternational}</span></div>
        <div>Spacegroup number: <span className="blue">{this.props.spacegroupNumber}</span></div>
        <div>Bravais lattice: <span className="blue">{this.props.bravaisLattice}</span></div>

      </div>
      );
    }
   
}

class CoordsBox extends Component{
  
  
  render(){
    const Cell_coords = this.props.CoordsBox['3D_structure_cell'];
    const Atomic_coords = this.props.CoordsBox['3D_structure_atomic_coords'];   
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
              {Object.keys(Cell_coords).map(i => { return(
                <tr>
                  <td>{i}</td>
                  <td>{Cell_coords[i].x}</td>
                  <td>{Cell_coords[i].y}</td>
                  <td>{Cell_coords[i].z}</td>
                </tr>)})
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
                  <td>{Atomic_coords[i].Kind_label}</td>
                  <td>{Atomic_coords[i].x}</td>
                  <td>{Atomic_coords[i].y}</td>
                  <td>{Atomic_coords[i].z}</td>
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
        this.state =  {
        isLoaded: false,
        compound: null,
        info: [],
        //cell_vectors: [],
        coords: [],
        error: null
    }
}
componentDidMount(){
  Promise.all([  
    fetch("https://dev-www.materialscloud.org/mcloud/api/v2/discover/3dd/compounds/Sb2Zr").then(res => res.json()),
    fetch("Sb2Zr_CoordsBox.json", {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}}).then(res => res.json())
  ]).then((allResponses) => {
      const info_data = allResponses[0];
      const coords_data = allResponses[1];
      //console.log("!");   
      //console.log(coords_data);
    return {"info_d":info_data, "coords_d":coords_data};
  })
        .then(
          (result) => {    
             const compound_curr = Object.keys(result.info_d.data)[0];
             //const cell_vectors_curr = result.coords_d.data[compound_curr]["3D_structure_cell"];
              //for (let i = 0; i < 5; i++){

              //}
            this.setState({
            isLoaded: true,
              info: result.info_d, 
              compound: compound_curr,
              coords: result.coords_d
              //cell_vectors
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
  }
  
 render() {
    //var compound = this.props.compound;

    // get JSON data for this compound
    //var data={"data":{"AgB2":[{"info":{"bravais_lattice":"hP","formula":"AgB2","spacegroup_international":"P6/mmm","spacegroup_number":191},"properties":{"total_energy":{"uuid":"9004a082-b699-4375-bb78-a2edd73533c2","value":-4081.72}},"source":[{"source_database":"MPDS","source_identifier":"S528990","source_url":"https://mpds.io/#entry/S528990","source_version":"1.0.0"}],"uuid_structure":"5fabc153-e6c4-4279-ab3e-01f5c0cb9096"}],"metadata":{"info":{"bravais_lattice":{"default_value":null,"description":"Bravais lattice","label":"Bravais lattice","order":4,"units":""},"formula":{"default_value":null,"description":"Chemical formula","label":"Formula","order":1,"units":""},"spacegroup_international":{"default_value":null,"description":"Spacegroup international","label":"Spacegroup international","order":2,"units":""},"spacegroup_number":{"default_value":null,"description":"Spacegroup number","label":"Spacegroup number","order":3,"units":""}},"order":["info","source","properties"],"properties":{"absolute_magnetization":{"default_value":"N/A","description":"Absolute magnetization","label":"Absolute magnetization","order":3,"units":"\u03bcB/cell"},"total_energy":{"default_value":null,"description":"Total energy","label":"Total energy","order":1,"units":"eV/cell"},"total_magnetization":{"default_value":"N/A","description":"Total magnetization","label":"Total magnetization","order":2,"units":"\u03bcB/cell"}},"source":{}}},"method":"GET","path":"/api/v2/discover/3dd/compounds/AgB2","url":"https://dev-www.materialscloud.org/mcloud/api/v2/discover/3dd/compounds/AgB2","url_root":"https://dev-www.materialscloud.org/mcloud/"};

    // show
    const { isLoaded, compound, data, error } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>loading...</div>;
    } else {
        return (
        <div className="details-page" > 
          <h1>Compound: <span>{this.state.compound}</span></h1>
          <Container fluid>
            <Row>
              <Col><Visualizer Coords={this.state.coords['data'][this.state.compound][0]}></Visualizer></Col>
              <Col>
                {<InfoBox 
                  bravaisLattice={this.state.info['data'][this.state.compound][0]['info']['bravais_lattice']} 
                  spacegroupInternational = {this.state.info['data'][this.state.compound][0]['info']['spacegroup_international']}
                  spacegroupNumber = {this.state.info['data'][this.state.compound][0]['info']['spacegroup_number']}
                  formula = {this.state.info['data'][this.state.compound][0]['info']['formula']}
                />}
                <XrdPlot />
              </Col>
            <Col><CoordsBox CoordsBox={this.state.coords['data'][this.state.compound][0]}></CoordsBox></Col>
            
            
            </Row>
            
          </Container>
        </div>  
    ); } 
    }

}

//<Col><Visualizer CoordsBox={this.state.coords['data'][this.state.compound][0]}></Visualizer></Col>//
   export default DetailPage;
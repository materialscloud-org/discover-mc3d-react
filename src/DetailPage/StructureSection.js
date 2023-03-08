import React from "react";

import Table from "react-bootstrap/Table";

import DownloadButton from "./components/DownloadButton";
import ExploreButton from "./components/ExploreButton";

import "./StructureSection.css";

class StructureSection extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.aiidaAttributes);
  }
  render() {
    let nDig = 4;
    return (
      <div className="structure-section">
        <b>Structural information</b>{" "}
        <ExploreButton uuid={this.props.compoundInfo.uuid_structure} />
        <div className="ssec-download-button-container">
          Download
          <DownloadButton uuid={this.props.compoundInfo.uuid_structure} />
        </div>
        <div className="structure-section-inner">
          <div>
            <p>Cell</p>
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th></th>
                  <th>x [Å]</th>
                  <th>y [Å]</th>
                  <th>z [Å]</th>
                </tr>
              </thead>
              <tbody>
                {this.props.aiidaAttributes.cell.map((v, i) => (
                  <tr key={i}>
                    <td>
                      v<sub>{i + 1}</sub>
                    </td>
                    <td>{v[0].toFixed(nDig)}</td>
                    <td>{v[1].toFixed(nDig)}</td>
                    <td>{v[2].toFixed(nDig)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div>
            <p>Atomic positions</p>
            <div className="atomic-pos-table">
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Kind label</th>
                    <th>x [Å]</th>
                    <th>y [Å]</th>
                    <th>z [Å]</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.aiidaAttributes.sites.map((r, i) => (
                    <tr key={i}>
                      <td>{r.kind_name}</td>
                      <td>{r.position[0].toFixed(nDig)}</td>
                      <td>{r.position[1].toFixed(nDig)}</td>
                      <td>{r.position[2].toFixed(nDig)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StructureSection;

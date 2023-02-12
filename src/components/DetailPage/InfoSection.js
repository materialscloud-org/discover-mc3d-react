import React from "react";

import "./InfoSection.css";

import StructureVisualizer from "mc-react-structure-visualizer";

class InfoBox extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props.compoundInfo);
    let info = this.props.compoundInfo["info"];
    let source = this.props.compoundInfo["source"];
    let props = this.props.compoundInfo["properties"];

    let tot_en_str = "N/A";
    if ("total_energy" in props)
      tot_en_str = `${props["total_energy"].value} eV/cell`;
    let tot_mag_str = "N/A";
    if ("total_magnetization" in props)
      tot_mag_str = `${props["total_magnetization"].value} μB/cell`;
    let abs_mag_str = "N/A";
    if ("absolute_magnetization" in props)
      abs_mag_str = `${props["absolute_magnetization"].value} μB/cell`;

    return (
      <div className="info-box">
        <div>
          <b>Info</b>
          <ul className="no-bullets">
            <li>Bravais Lattice: {info["bravais_lattice"]}</li>
            <li>Spacegroup international: {info["spacegroup_international"]}</li>
            <li>Spacegroup number: {info["spacegroup_number"]}</li>
          </ul>
        </div>
        <div>
          <b>Source</b>
          <ul className="no-bullets">
          {source.map((s) => (
            <li key={s["source_id"]}>
              <a href={s["source_url"]} title={"Go to source data"}>
                {s["source_database"]}
              </a>{" "}
              ID: {s["source_id"]}
            </li>
          ))}
          </ul>
        </div>
        <div>
          <b>Properties</b>
          <ul className="no-bullets">
            <li>Total energy: {tot_en_str}</li>
            <li>Total magnetization: {tot_mag_str}</li>
            <li>Absolute magnetization: {abs_mag_str}</li>
          </ul>
        </div>
      </div>
    );
  }
}

class InfoSection extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="info-section">
        <b>General info</b>
        <div className="info-section-inner">
          <StructureVisualizer cifText={this.props.cifText}/>
          <InfoBox compoundInfo={this.props.compoundInfo} />
        </div>
      </div>
    );
  }
}

export default InfoSection;

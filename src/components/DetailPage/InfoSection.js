import React from "react";

import "./InfoSection.css";

import StructureVisualizer from "./StructureVisualizer";

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
          <p>Bravais Lattice: {info["bravais_lattice"]}</p>
          <p>Spacegroup international: {info["spacegroup_international"]}</p>
          <p>Spacegroup number: {info["spacegroup_number"]}</p>
        </div>
        <div>
          <b>Source</b>
          {source.map((s) => (
            <p key={s["source_id"]}>
              <a href={s["source_url"]} title={"Go to source data"}>
                {s["source_database"]}
              </a>{" "}
              ID: {s["source_id"]}
            </p>
          ))}
        </div>
        <div>
          <b>Properties</b>
          <p>Total energy: {tot_en_str}</p>
          <p>Total magnetization: {tot_mag_str}</p>
          <p>Absolute magnetization: {abs_mag_str}</p>
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
          <StructureVisualizer aiidaAttributes={this.props.aiidaAttributes}/>
          <InfoBox compoundInfo={this.props.compoundInfo} />
        </div>
      </div>
    );
  }
}

export default InfoSection;

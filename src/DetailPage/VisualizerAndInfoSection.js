import React from "react";

import "./VisualizerAndInfoSection.css";

import StructureVisualizer from "mc-react-structure-visualizer";

import DownloadButton from "./components/DownloadButton";
import ExploreButton from "./components/ExploreButton";

import { formatSpaceGroupSymbol } from "../common/utils";

class InfoBox extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("compoundInfo", this.props.compoundInfo);
    let info = this.props.compoundInfo["info"];
    let source = this.props.compoundInfo["source"];
    let props = this.props.compoundInfo["properties"];

    let tot_en_jsx = <span>N/A</span>;
    if ("total_energy" in props)
      tot_en_jsx = (
        <span>
          {`${props["total_energy"].value} eV/cell `}
          <ExploreButton uuid={props["total_energy"].uuid} />
        </span>
      );

    let tot_mag_jsx = <span>N/A</span>;
    if ("total_magnetization" in props)
      tot_mag_jsx = (
        <span>
          {`${props["total_magnetization"].value} μB/cell `}
          <ExploreButton uuid={props["total_magnetization"].uuid} />
        </span>
      );

    let abs_mag_jsx = <span>N/A</span>;
    if ("absolute_magnetization" in props)
      abs_mag_jsx = (
        <span>
          {`${props["absolute_magnetization"].value} μB/cell `}
          <ExploreButton uuid={props["absolute_magnetization"].uuid} />
        </span>
      );

    return (
      <div className="info-box">
        <div>
          <b>Info</b>
          <ul className="no-bullets">
            <li>Bravais Lattice: {info["bravais_lattice"]}</li>
            <li>
              Space group international:{" "}
              {formatSpaceGroupSymbol(info["spacegroup_international"])}
            </li>
            <li>Space group number: {info["spacegroup_number"]}</li>
          </ul>
        </div>
        <div>
          <b>Source</b>
          <ul className="no-bullets">
            {source.map((s) => (
              <li key={s["source_id"]}>
                <a
                  className="source-a"
                  href={s["source_url"]}
                  title={"Go to source data"}
                >
                  {s["source_database"]} ID: {s["source_id"]}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <b>Properties</b>
          <ul className="no-bullets">
            <li>Total energy: {tot_en_jsx}</li>
            <li>Total magnetization: {tot_mag_jsx}</li>
            <li>Absolute magnetization: {abs_mag_jsx}</li>
          </ul>
        </div>
      </div>
    );
  }
}

class VisualizerAndInfoSection extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="info-section">
        <div className="info-section-inner">
          <div className="structure-view-section">
            <div style={{ margin: "2px 0px 6px 0px" }}>
              <b>Structure</b>{" "}
              <ExploreButton uuid={this.props.compoundInfo.uuid_structure} />
            </div>
            <StructureVisualizer cifText={this.props.cifText} />
            <div className="download-button-container">
              <DownloadButton uuid={this.props.compoundInfo.uuid_structure} />
            </div>
          </div>
          <InfoBox compoundInfo={this.props.compoundInfo} />
        </div>
      </div>
    );
  }
}

export default VisualizerAndInfoSection;

import React from "react";

import "./VisualizerAndInfoSection.css";

import StructureVisualizer from "mc-react-structure-visualizer";

import DownloadButton from "./components/DownloadButton";
import ExploreButton from "./components/ExploreButton";

import { formatSpaceGroupSymbol } from "../common/utils";

import IcsdLogo from "../images/icsd.png";
import CodLogo from "../images/cod.png";
import MpdsLogo from "../images/mpds.png";

function sourceUrl(source) {
  if (source["database"] == "MPDS") {
    return `https://mpds.io/#entry/${source["id"]}`;
  }
  if (source["database"] == "COD") {
    return `http://www.crystallography.net/cod/${source["id"]}.html`;
  }
  if (source["database"] == "ICSD") {
    return `https://icsd.fiz-karlsruhe.de/linkicsd.xhtml?coll_code=${source["id"]}`;
  }
  return null;
}

class InfoBox extends React.Component {
  constructor(props) {
    super(props);
  }

  createPropertyLine(name) {
    console.log(this.props);
    let pts = this.props.compoundInfo["properties"];
    let meta = this.props.metadata["properties"][name];
    let jsx = <span>{meta["label"]}: N/A</span>;
    if (name in pts)
      jsx = (
        <span>
          {`${meta["label"]}: ${pts[name].value} ${meta["units"]} `}
          <ExploreButton uuid={pts[name].uuid} />
        </span>
      );
    return jsx;
  }

  render() {
    console.log("compoundInfo", this.props.compoundInfo);
    let info = this.props.compoundInfo["info"];
    let source = this.props.compoundInfo["source"];

    let propertyList = [
      "total_energy",
      "cell_volume",
      "total_magnetization",
      "absolute_magnetization",
    ];

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
            {source.map((s) => {
              let logo = null;
              if (s["database"] == "ICSD") logo = IcsdLogo;
              if (s["database"] == "COD") logo = CodLogo;
              if (s["database"] == "MPDS") logo = MpdsLogo;
              return (
                <li key={s["id"]}>
                  <a
                    className="source-a"
                    href={sourceUrl(s)}
                    title={"Go to source data"}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        gap: "5px",
                        alignItems: "center",
                      }}
                    >
                      <img src={logo} style={{ height: "20px" }}></img>
                      {s["database"]} ID: {s["id"]}
                    </div>
                  </a>
                  <div
                    style={{
                      display: "block",
                      marginLeft: "25px",
                    }}
                  >
                    {s["exp_observed"]
                      ? "(experimentally observed)"
                      : "(unknown if experimentally observed)"}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <b>Properties</b>
          <ul className="no-bullets">
            {propertyList.map((name) => (
              <li key={name}>{this.createPropertyLine(name)}</li>
            ))}
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
          <InfoBox
            compoundInfo={this.props.compoundInfo}
            metadata={this.props.metadata}
          />
        </div>
      </div>
    );
  }
}

export default VisualizerAndInfoSection;

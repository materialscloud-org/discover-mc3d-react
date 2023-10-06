import React from "react";

import "./VisualizerAndInfoSection.css";

import StructureVisualizer from "mc-react-structure-visualizer";

import DownloadButton from "./components/DownloadButton";
import ExploreButton from "./components/ExploreButton";

import HelpButton from "../common/HelpButton";
import Popover from "react-bootstrap/Popover";

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

const PROPERTY_LABELS = {
  total_energy: "Total energy",
  cell_volume: "Cell volume",
  total_magnetization: "Total magnetization",
  absolute_magnetization: "Absolute magnetization",
};

function SourceInfo(props) {
  // currently assume that only one source exists
  const source = props.source[0];

  // determine extra info label and popup
  let infoTextList = [];
  let infoPopupList = [];

  let hpThresh = props.metadata["high_pressure_threshold"];
  let htThresh = props.metadata["high_temperature_threshold"];

  if (source["info"]["is_theoretical"]) {
    infoTextList.push("theoretical origin");
    infoPopupList.push("is of theoretical origin");
  }
  if (source["info"]["is_high_pressure"]) {
    infoTextList.push("high pressure");
    infoPopupList.push(
      `was characterized at a pressure higher than ${hpThresh["value"]} ${hpThresh["units"]}`
    );
  }
  if (source["info"]["is_high_temperature"]) {
    infoTextList.push("high temperature");
    infoPopupList.push(
      `was characterized at a temperature higher than ${htThresh["value"]} ${htThresh["units"]}`
    );
  }

  let infoText = "";
  if (infoTextList.length > 0) {
    infoText = infoTextList.join("; ");
    infoText = `(${infoText})`;
  }

  for (let i = 0; i < infoPopupList.length; i++) {
    if (i < infoPopupList.length - 1) {
      infoPopupList[i] = infoPopupList[i] + ";";
    } else {
      infoPopupList[i] = infoPopupList[i] + ".";
    }
  }

  const sourcePopover = (
    <Popover id="popover-basic">
      <Popover.Body>
        The source database reported that the source crystal
        <ul style={{ margin: "0" }}>
          {infoPopupList.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </Popover.Body>
    </Popover>
  );

  let showInfoText = infoText != "";

  return (
    <ul className="no-bullets">
      {props.source.map((s) => {
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
            {showInfoText ? (
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  marginLeft: "10px",
                  alignItems: "center",
                }}
              >
                {infoText}
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    fontSize: "14px",
                  }}
                >
                  <HelpButton popover={sourcePopover} placement="top" />
                </div>
              </div>
            ) : (
              <></>
            )}
          </li>
        );
      })}
    </ul>
  );
}

class InfoBox extends React.Component {
  constructor(props) {
    super(props);
  }

  createPropertyLine(name) {
    let pts = this.props.compoundInfo["properties"];
    let label = PROPERTY_LABELS[name];
    let unit = "";
    if (name in this.props.metadata) {
      if ("units" in this.props.metadata[name])
        unit = this.props.metadata[name]["units"];
    }
    let jsx = <span>{label}: N/A</span>;
    if (name in pts)
      jsx = (
        <span>
          {`${label}: ${pts[name].value.toFixed(3)} ${unit} `}
          <ExploreButton uuid={pts[name].uuid} />
        </span>
      );
    return jsx;
  }

  render() {
    let info = this.props.compoundInfo["info"];

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
          <SourceInfo
            source={this.props.compoundInfo["source"]}
            metadata={this.props.metadata}
          />
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

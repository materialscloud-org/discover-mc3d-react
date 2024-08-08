import Popover from "react-bootstrap/Popover";

import IcsdLogo from "../../assets/icsd.png";
import CodLogo from "../../assets/cod.png";
import MpdsLogo from "../../assets/mpds.png";

import { HelpButton } from "mc-react-library";

import "./SourceInfo.css";

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

const SourceInfoText = ({ source, metadata }) => {
  if (!("info" in source)) {
    console.warn("source['info'] not present.");
    return null;
  }

  if (!("info" in metadata)) {
    console.warn("metadata['info'] not present.");
    return null;
  }

  // determine extra info label and popup
  let infoTextList = [];
  let infoPopupList = [];

  let hpThresh = metadata.info.source["high_pressure_threshold"];
  let htThresh = metadata.info.source["high_temperature_threshold"];

  if (source["info"]["is_theoretical"]) {
    infoTextList.push("theoretical origin");
    infoPopupList.push("is of theoretical origin");
  }
  if (source["info"]["is_high_pressure"]) {
    infoTextList.push("high pressure");
    infoPopupList.push(
      `was characterized at a pressure higher than ${hpThresh["value"]} ${hpThresh["unit"]}`,
    );
  }
  if (source["info"]["is_high_temperature"]) {
    infoTextList.push("high temperature");
    infoPopupList.push(
      `was characterized at a temperature higher than ${htThresh["value"]} ${htThresh["unit"]}`,
    );
  }

  let infoText = "";
  if (infoTextList.length > 0) {
    infoText = infoTextList.join("; ");
    infoText = `(${infoText})`;
  }

  if (infoText == "") {
    return null;
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

  return (
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
  );
};

function SourceInfo({ sources, metadata }) {
  // currently assume that only one source exists
  const source = sources[0];

  return (
    <ul className="no-bullets">
      {sources.map((s) => {
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
            <SourceInfoText source={source} metadata={metadata} />
          </li>
        );
      })}
    </ul>
  );
}

export default SourceInfo;

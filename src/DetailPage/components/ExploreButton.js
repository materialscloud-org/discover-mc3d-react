import React from "react";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import "./ExploreButton.css";

import AiidaLogo from "../../images/aiida-logo-128.png";

export default function ExploreButton(props) {
  var url = `https://www.materialscloud.org/explore/mc3d/details/${props.uuid}?nodeType=NODE`;
  return (
    <OverlayTrigger
      placement={"bottom"}
      overlay={
        <Tooltip className="explore-tooltip">
          Browse provenance
          <br />
          {props.uuid}
        </Tooltip>
      }
    >
      <a href={url} target="_blank" className="explore-a">
        <img src={AiidaLogo} className="aiida-logo"></img>
      </a>
    </OverlayTrigger>
  );
}

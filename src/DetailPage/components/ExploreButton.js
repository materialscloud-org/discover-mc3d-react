import React from "react";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import "./ExploreButton.css";

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
      <a href={url} target="_blank">
        <img
          src="./aiida-logo-128.png"
          style={{ height: "15px", margin: "8px 2px" }}
        ></img>
      </a>
    </OverlayTrigger>
  );
}

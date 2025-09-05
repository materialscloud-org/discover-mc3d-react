import React from "react";

import "./TitleAndLogo.css";

import Mc3dLogo from "../assets/mc3d.png";

import { DoiBadge } from "mc-react-library";

export default function TitleAndLogo({
  titleString = "Materials Cloud Three-Dimensional Structure Database (MC3D)",
  imgSrc = Mc3dLogo,
  doiId = "rw-t0",
}) {
  return (
    <div className="title-and-logo">
      <div className="title-and-doi">
        <span className="title-span">{titleString}</span>
        <div style={{ marginLeft: "4px" }}>
          <DoiBadge doi_id={doiId} label="Data DOI" />
        </div>
      </div>
      <img src={imgSrc} className="mc3d-logo" alt="MC3D Logo" />
    </div>
  );
}

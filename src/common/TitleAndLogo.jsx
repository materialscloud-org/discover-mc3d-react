import React from "react";

import "./TitleAndLogo.css";

import Mc3dLogo from "../assets/mc3d.png";

import { DoiBadge } from "mc-react-library";

export default function TitleAndLogo() {
  return (
    <div className="title-and-logo">
      <div className="title-and-doi">
        <span className="title-span">
          Materials Cloud three-dimensional crystals database (MC3D)
        </span>
        <div style={{ marginLeft: "4px" }}>
          <DoiBadge doi_id="rw-t0" />
        </div>
      </div>
      <img src={Mc3dLogo} className="mc3d-logo"></img>
    </div>
  );
}

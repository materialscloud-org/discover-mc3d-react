import React from "react";

import "./TitleAndLogo.css";

import Mc3dLogo from "../images/mc3d.png";

import DoiBadge from "./DoiBadge";

export default function TitleAndLogo() {
  return (
    <div className="title-and-logo">
      <div className="title-and-doi">
        <span className="title-span">
          Materials Cloud three-dimensional crystals database (MC3D)
        </span>
        <div style={{ marginLeft: "4px" }}>
          <DoiBadge />
        </div>
      </div>
      <img src={Mc3dLogo} className="mc3d-logo"></img>
    </div>
  );
}

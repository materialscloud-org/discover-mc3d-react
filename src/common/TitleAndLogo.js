import React from "react";

import "./TitleAndLogo.css";

import Mc3dLogo from "../images/mc3d.png";

export default function TitleAndLogo() {
  return (
    <div className="title-and-logo">
      <span>Materials Cloud three-dimensional crystals database (MC3D)</span>
      <img src={Mc3dLogo} className="mc3d-logo"></img>
    </div>
  );
}

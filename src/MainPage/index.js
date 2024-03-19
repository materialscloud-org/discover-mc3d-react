import React, { useEffect, useState } from "react";

import "./index.css";

import MaterialSelector from "mc-react-ptable-materials-grid";

import TitleAndLogo from "../common/TitleAndLogo";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { aboutText } from "./about";
import { restapiText } from "./restapi";

import { loadDataMc3d } from "./loadDataMc3d";

function MainPage() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    loadDataMc3d().then((loadedData) => {
      setColumns(loadedData.columns);
      setRows(loadedData.rows);
    });
  }, []);

  return (
    <div className="main-page">
      <TitleAndLogo />
      <div className="description">
        Curated set of relaxed three-dimensional crystal structures based on raw
        CIF data from the experimental databases MPDS, COD, and ICSD.
      </div>
      <Tabs defaultActiveKey="use" className="mc3d-tabs">
        <Tab eventKey="use" title="Use">
          <div className="description">Search for materials:</div>
          <MaterialSelector columns={columns} rows={rows} />
        </Tab>
        <Tab eventKey="about" title="About">
          {aboutText}
        </Tab>
        <Tab eventKey="rest" title="REST API">
          {restapiText}
        </Tab>
      </Tabs>
    </div>
  );
}

export default MainPage;

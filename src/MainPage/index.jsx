import React, { useEffect, useState, useRef } from "react";

import "./index.css";

import MaterialsCloudHeader from "mc-react-header";

import MaterialSelector from "mc-react-ptable-materials-grid";

import TitleAndLogo from "../common/TitleAndLogo";

import { Container, Tab, Tabs, Form } from "react-bootstrap";

import { aboutText } from "./about";
import { restapiText } from "./restapi";

import { loadDataMc3d } from "./loadDataMc3d";

import { DownloadButton } from "./DownloadButton";

import { MethodSelectionBox } from "./MethodSelectionBox";
import { loadGeneralInfo } from "../common/restApiUtils";

function MainPage() {
  const [genInfo, setGenInfo] = useState(null);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [method, setMethod] = useState("pbesol-v1");

  useEffect(() => {
    loadGeneralInfo().then((loadedData) => {
      setGenInfo(loadedData);
      console.log(loadedData);
    });
  }, []);

  useEffect(() => {
    loadDataMc3d(method).then((loadedData) => {
      setColumns(loadedData.columns);
      setRows(loadedData.rows);
    });
  }, [method]);

  const handleMethodChange = (event) => {
    setRows([]);
    setColumns([]);
    setMethod(event.target.value);
  };

  const materialSelectorRef = useRef(null);

  return (
    <MaterialsCloudHeader
      activeSection={"discover"}
      breadcrumbsPath={[
        { name: "Discover", link: "https://www.materialscloud.org/discover" },
        {
          name: "Materials Cloud Three-Dimensional Structure Database",
          link: null,
        },
      ]}
    >
      <Container fluid="xxl">
        <TitleAndLogo />
        <div className="description">
          The Materials Cloud Three-Dimensional Structure Database is a curated
          dataset of unique, stoichiometric, experimentally known inorganic
          compounds, and of their calculated properties. Structures have
          obtained with fully-relaxed density-functional theory calculations,
          starting from experimental ones imported, cleaned and parsed from the
          MPDS, COD and ICSD databases.
        </div>
        <Tabs defaultActiveKey="use">
          <Tab eventKey="use" title="Use">
            <MethodSelectionBox
              genInfo={genInfo}
              method={method}
              handleMethodChange={handleMethodChange}
            />
            {/* <div className="description">
              Search for materials in the selected subdatabase by filtering
              based on the periodic table and the columns of the table below:
            </div> */}
            <MaterialSelector
              ref={materialSelectorRef}
              columns={columns}
              rows={rows}
            />
            <DownloadButton
              materialSelectorRef={materialSelectorRef}
              disabled={rows.length == 0}
              methodLabel={method}
            />
          </Tab>
          <Tab eventKey="about" title="About">
            {aboutText}
          </Tab>
          <Tab eventKey="rest" title="REST API">
            {restapiText}
          </Tab>
        </Tabs>
      </Container>
    </MaterialsCloudHeader>
  );
}

export default MainPage;

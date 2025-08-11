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

import {
  PRESETS,
  getColumnConfigFromUrl,
  applyColumnStateFromUrl,
} from "./tableConfig";

const DEFAULT_METHOD = "pbesol-v1";

function getInitialMethodFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);

  // Get method from URL
  const methodFromUrl = urlParams.get("method");

  if (methodFromUrl) {
    return methodFromUrl;
  }

  // If no method in URL, check preset from URL
  const presetName = urlParams.get("preset");
  if (presetName && PRESETS[presetName] && PRESETS[presetName].method) {
    return PRESETS[presetName].method;
  }

  // fallback default method
  return "pbesol-v1";
}

function getInitialColumnConfigFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return getColumnConfigFromUrl(urlParams, PRESETS);
}

// MC3D Landing page React component.
function MainPage() {
  const [genInfo, setGenInfo] = useState(null);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [method, setMethod] = useState(getInitialMethodFromUrl());

  const materialSelectorRef = useRef(null);

  useEffect(() => {
    loadGeneralInfo().then(setGenInfo);
  }, []);

  // On first load: get columns config & data
  useEffect(() => {
    const { sortEntries, hiddenFields, showFields } =
      getInitialColumnConfigFromUrl();

    loadDataMc3d(method).then((loadedData) => {
      const sortedColumns = applyColumnStateFromUrl(
        loadedData.columns,
        sortEntries,
        hiddenFields,
        showFields,
      );
      setColumns(sortedColumns);
      setRows(loadedData.rows);
    });
  }, []);

  // when method changes: only reload rows, keep existing columns
  useEffect(() => {
    if (!method) return;
    loadDataMc3d(method).then((loadedData) => {
      setRows(loadedData.rows);
    });
  }, [method]);

  const handleMethodChange = (event) => {
    setRows([]);
    setMethod(event.target.value);
  };

  console.log("Loaded Columns", columns);

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
          compounds, and of their calculated properties. Structures have been
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

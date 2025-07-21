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

// Define presets here.
const PRESETS = {
  MinTable: {
    sort: "num_atoms:desc,num_elements:desc",
    hiddenColumns: ["spacegroup_number", "id", "formula"],
  },
};

function getMethodFromUrl(urlSearchParams) {
  const urlMethod = urlSearchParams.get("method");
  return urlMethod;
}

// urlColumnConfig.js
function getColumnConfigFromUrl(urlSearchParams, presets) {
  const sortParam = urlSearchParams.get("sort");
  const hideParam = urlSearchParams.get("hide");
  const presetParam = urlSearchParams.get("preset");

  let sortEntries = [];
  let hiddenFields = [];

  if (presetParam && presets[presetParam]) {
    const preset = presets[presetParam];
    sortEntries = preset.sort
      ? preset.sort.split(",").map((entry, idx) => {
          const [field, dir] = entry.split(":");
          return { field, sort: dir, sortIndex: idx };
        })
      : [];
    hiddenFields = preset.hiddenColumns || [];
  } else {
    sortEntries = sortParam
      ? sortParam.split(",").map((entry, idx) => {
          const [field, dir] = entry.split(":");
          return { field, sort: dir, sortIndex: idx };
        })
      : [];
    hiddenFields = hideParam ? hideParam.split(",") : [];
  }

  return { sortEntries, hiddenFields };
}

function applyColumnStateFromUrl(columns, sortEntries, hiddenFields) {
  return columns.map((col) => {
    const updatedCol = { ...col };
    const match = sortEntries.find((s) => s.field === col.field);
    if (match) {
      updatedCol.sort = match.sort;
      updatedCol.sortIndex = match.sortIndex;
    }
    if (hiddenFields.includes(col.field)) {
      updatedCol.hide = true;
    }
    return updatedCol;
  });
}

function MainPage() {
  const [genInfo, setGenInfo] = useState(null);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  // default method defined here.
  const DEFAULT_METHOD = "pbesol-v1";
  const [method, setMethod] = useState(DEFAULT_METHOD);

  useEffect(() => {
    loadGeneralInfo().then((loadedData) => {
      setGenInfo(loadedData);
      console.log(loadedData);
    });
  }, []);

  // on page load: get method + initial columns config from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlMethod = urlParams.get("method") || DEFAULT_METHOD;
    setMethod(urlMethod);

    const { sortEntries, hiddenFields } = getColumnConfigFromUrl(
      urlParams,
      PRESETS,
    );

    loadDataMc3d(urlMethod).then((loadedData) => {
      const sortedColumns = applyColumnStateFromUrl(
        loadedData.columns,
        sortEntries,
        hiddenFields,
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

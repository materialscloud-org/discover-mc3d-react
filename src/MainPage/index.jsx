import { useEffect, useState, useRef } from "react";

import "./index.css";

import MaterialsCloudHeader from "mc-react-header";

import MaterialSelector from "mc-react-ptable-materials-grid";

import TitleAndLogo from "../common/TitleAndLogo";

import { Container, Tab, Tabs } from "react-bootstrap";

import { aboutText } from "./about";
import { restapiText } from "./restapi";

import { loadDataMc3d } from "./loadDataMc3d";

import { DownloadButton } from "./DownloadButton";

import { MethodSelectionBox } from "./MethodSelectionBox";
import { loadGeneralInfo } from "../common/restApiUtils";

import { CitationsList } from "../common/CitationsList.jsx";

import {
  updateColumnsFromUrl,
  getMethodFromUrl,
  getMethodFromPreset,
} from "./handleUrlParams";

const DEFAULT_METHOD = "pbesol-v2";

// MC3D Landing page React component.
function MainPage() {
  const urlParams = new URLSearchParams(window.location.search);

  const [genInfo, setGenInfo] = useState(null);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  // derive current method and preset directly from URL
  const preset = urlParams.get("preset") || null;
  const method = preset
    ? getMethodFromPreset(preset)
    : getMethodFromUrl(urlParams, DEFAULT_METHOD);

  const materialSelectorRef = useRef(null);

  useEffect(() => {
    loadGeneralInfo().then(setGenInfo);
  }, []);

  useEffect(() => {
    loadDataMc3d(method).then((loadedData) => {
      const updatedColumns = updateColumnsFromUrl(
        loadedData.columns,
        urlParams,
      );
      setColumns(updatedColumns);
      setRows(loadedData.rows);
    });
  }, [method, preset]);

  const handleMethodChange = (event) => {
    const selected = event.target.value;
    const url = new URL(window.location);

    if (selected === "superconductivity") {
      // Preset
      url.searchParams.set("preset", selected);
      url.searchParams.delete("method");
    } else {
      // Normal DB
      url.searchParams.set("method", selected);
      url.searchParams.delete("preset");
    }

    window.history.pushState({}, "", url.toString());
    setRows([]); // clear table
  };

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
          MPDS, COD and ICSD databases. For more details, please see the related
          publication:
          <div style={{ margin: "10px" }}>
            <CitationsList citationLabels={["HuberMc3d25"]} />
          </div>
        </div>

        <Tabs defaultActiveKey="use">
          <Tab eventKey="use" title="Use">
            <MethodSelectionBox
              genInfo={genInfo}
              method={method}
              selectedDisplay={preset || null} // display "preset value" if preset active
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

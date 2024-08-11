import React, { useEffect, useState, useRef } from "react";

import "./index.css";

import MaterialsCloudHeader from "mc-react-header";

import MaterialSelector from "mc-react-ptable-materials-grid";

import TitleAndLogo from "../common/TitleAndLogo";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { aboutText } from "./about";
import { restapiText } from "./restapi";

import { loadDataMc3d } from "./loadDataMc3d";

import { DownloadButton } from "./DownloadButton";

import Form from "react-bootstrap/Form";

function MainPage() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [method, setMethod] = useState("pbe-v1");

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
          name: "Materials Cloud three-dimensional crystals database",
          link: null,
        },
      ]}
    >
      <div className="main-page">
        <TitleAndLogo />
        <div className="description">
          Materials Cloud three-dimensional crystals database is a curated set
          of computationally relaxed three-dimensional crystal structures and
          calculated properties. The crystal structures originate from
          experimental databases.
        </div>
        <Tabs defaultActiveKey="use">
          <Tab eventKey="use" title="Use">
            <div className="description">
              Select a methodology:{" "}
              <Form.Select
                size="sm"
                value={method}
                onChange={handleMethodChange}
                style={{
                  width: "260px",
                  display: "inline",
                  margin: "4px 6px 2px 6px",
                }}
              >
                <option value="pbesol-v2">PBEsol-v2</option>
                <option value="pbe-v1">PBE-v1</option>
              </Form.Select>
              <br />
              <br />
              Search for materials by filtering based on the periodic table and
              the columns of the table below:
            </div>
            <MaterialSelector
              ref={materialSelectorRef}
              columns={columns}
              rows={rows}
            />
            <DownloadButton
              materialSelectorRef={materialSelectorRef}
              disabled={rows.length == 0}
            />
          </Tab>
          <Tab eventKey="about" title="About">
            {aboutText}
          </Tab>
          <Tab eventKey="rest" title="REST API">
            {restapiText}
          </Tab>
        </Tabs>
      </div>
    </MaterialsCloudHeader>
  );
}

export default MainPage;

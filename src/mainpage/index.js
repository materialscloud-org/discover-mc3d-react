import React from "react";

import "./index.css";

import MaterialSelector from "mc-react-ptable-materials-grid";

import TitleAndLogo from "../common/TitleAndLogo";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { aboutText } from "./about";
import { restapiText } from "./restapi";

import {
  spaceGroupSymbols,
  bravaisLatticeFromSpgn,
} from "../common/symmetryUtils";

/* The MaterialsSelector needs two inputs:
 1) column definitions
 2) async function that loads data

 The data needs to be an array of row objects, whereas each row needs contain
 * entries for all the columns, with the key matching the 'field' string of the column.
 * 'elem_array', which is used in the periodic table filtering.
 */

/* Define the columns
 some columns are special: id, formula (see the implementation)
 * colType: "text", "integer", "float" - defines formatting & filters
 * hide: true if the column is hidden initially
 any additional input is passed to ag-grid column definitions (e.g. width) 
 */

const columns = [
  {
    field: "id",
    headerName: "ID",
    colType: "text",
  },
  {
    field: "formula",
    headerName: "Formula",
    colType: "text",
    // width: 180,
  },
  {
    field: "n_elem",
    headerName: "Num. of elements",
    colType: "integer",
    hide: true,
  },
  {
    field: "bravais_lat",
    headerName: "Bravais lattice",
    colType: "text",
    width: 120,
  },
  {
    field: "spg_int",
    headerName: "Space group international",
    colType: "text",
  },
  {
    field: "spg_num",
    headerName: "Space group number",
    colType: "integer",
    hide: true,
    // width: 120,
  },
  {
    field: "tot_mag",
    headerName: "Total magnetization",
    unit: "μB/cell",
    colType: "float",
  },
  {
    field: "abs_mag",
    headerName: "Absolute magnetization",
    unit: "μB/cell",
    colType: "float",
  },
];

function calcElementArray(formula) {
  var formula_no_numbers = formula.replace(/[0-9]/g, "");
  var elements = formula_no_numbers.split(/(?=[A-Z])/);
  return elements;
}

function formatRows(compounds) {
  var rows = [];
  //var compounds = { Ag5O4Si: compounds_["Ag5O4Si"] };
  Object.keys(compounds).forEach((i) => {
    Object.keys(compounds[i]).forEach((j) => {
      var comp = compounds[i][j];
      var elemArr = calcElementArray(i);
      var row = {
        id: comp["id"],
        formula: i,
        spg_int: spaceGroupSymbols[comp["spgn"]],
        spg_num: comp["spgn"],
        tot_mag: "tm" in comp ? comp["tm"] : null,
        abs_mag: "am" in comp ? comp["am"] : null,
        n_elem: elemArr.length,
        bravais_lat: bravaisLatticeFromSpgn(comp["spgn"]),
        elem_array: elemArr,
        href: `${process.env.PUBLIC_URL}/#/details/${i}/${comp["id"]}`,
      };
      rows.push(row);
    });
  });
  return rows;
}

async function loadDataMc3d() {
  let compounds_url =
    "https://www.materialscloud.org/mcloud/api/v2/discover/mc3d/compounds";

  const response = await fetch(compounds_url, { method: "get" });
  const json = await response.json();

  // return a Promise of the correctly formatted data
  return formatRows(json.data.compounds);
}

function MainPage() {
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
          <MaterialSelector columns={columns} loadData={loadDataMc3d} />
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

import React from "react";

import "./index.css";

import MaterialSelector from "mc-react-ptable-materials-grid";

import TitleAndLogo from "../common/TitleAndLogo";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { aboutText } from "./about";
import { restapiText } from "./restapi";

import { REST_API_COMPOUNDS } from "../common/config";

import {
  spaceGroupSymbols,
  bravaisLatticeFromSpgn,
} from "../common/symmetryUtils";
import { variationPlacements } from "@popperjs/core";

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
    field: "exp_observed",
    headerName: "Experim. observed",
    colType: "text",
    width: 120,
  },
  {
    field: "n_elem",
    headerName: "Num. of elements",
    colType: "integer",
    hide: true,
    width: 120,
  },
  {
    field: "n_atoms",
    headerName: "Num. of atoms/cell",
    colType: "integer",
    hide: true,
    width: 120,
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
    width: 120,
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

function countNumberOfAtoms(formula) {
  // split on capital letters to get element+number strings
  var elnum = formula.split(/(?=[A-Z])/);
  var num = 0;
  elnum.forEach((v) => {
    let match = v.match(/\d+/);
    let n = match == null ? 1 : parseInt(match[0]);
    num += n;
  });
  return num;
}

function formatRows(entries) {
  var rows = [];

  // var entries = {
  //   "mc3d-10": entries["mc3d-10"],
  //   "mc3d-228": entries["mc3d-228"],
  //   "mc3d-10010": entries["mc3d-10010"],
  //   "mc3d-10019": entries["mc3d-10019"],
  //   "mc3d-10802": entries["mc3d-10802"],
  //   "mc3d-75049": entries["mc3d-75049"],
  // };

  Object.keys(entries).forEach((i) => {
    var comp = entries[i];
    var elemArr = calcElementArray(comp["formula"]);
    var exp_obs = true;
    if ("flg" in comp && comp["flg"].includes("th")) exp_obs = false;

    Object.keys(comp["xc"]).forEach((func) => {
      var mc3d_id = `${i}/${func}`;
      var row = {
        id: mc3d_id,
        formula: comp["formula"],
        spg_num: comp["sg"],
        spg_int: spaceGroupSymbols[comp["sg"]],
        bravais_lat: bravaisLatticeFromSpgn(comp["sg"]),
        tot_mag: comp["xc"][func]["tm"] ?? null,
        abs_mag: comp["xc"][func]["am"] ?? null,
        n_elem: elemArr.length,
        elem_array: elemArr,
        n_atoms: countNumberOfAtoms(comp["formula"]),
        href: `${process.env.PUBLIC_URL}/#/details/${comp["formula"]}/${mc3d_id}`,
        exp_observed: exp_obs,
      };
      rows.push(row);
    });
  });
  return rows;
}

async function loadDataMc3d() {
  const response = await fetch(REST_API_COMPOUNDS, { method: "get" });
  const json = await response.json();

  // return a Promise of the correctly formatted data
  return formatRows(json.data);
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

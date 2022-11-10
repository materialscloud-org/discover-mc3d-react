import './App.css';
import './mcloud_theme.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css';

import MaterialSelector from "react-ptable-materials-grid2";

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
    width: 180,
  },
  {
    field: "n_elem",
    headerName: "Num. of elements",
    colType: "integer",
    hide: true,
  },
  {
    field: "spg_int",
    headerName: "Spacegroup int.",
    colType: "text",
  },
  {
    field: "spg_num",
    headerName: "Spacegroup nr.",
    colType: "integer",
  },
  {
    field: "tot_mag",
    headerName: "Total magn.",
    colType: "float",
  },
  {
    field: "abs_mag",
    headerName: "Abs. magn.",
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
        spg_int: comp["spg"],
        spg_num: comp["spgn"],
        tot_mag: "tm" in comp ? comp["tm"] : null,
        abs_mag: "am" in comp ? comp["am"] : null,
        n_elem: elemArr.length,
        elem_array: elemArr,
        href: `/details/${i}/${comp["id"]}`,
      };
      rows.push(row);
    });
  });
  return rows;
}

async function loadDataMc3d() {
  let compounds_url =
    "https://dev-www.materialscloud.org/mcloud/api/v2/discover/mc3d/compounds";

  const response = await fetch(compounds_url, { method: "get" });
  const json = await response.json();

  // return a Promise of the correctly formatted data
  return formatRows(json.data.compounds);
}

function App() {
  return (
    <div className="App">
      <MaterialSelector columns={columns} loadData={loadDataMc3d} />
    </div>
  );
}

export default App;

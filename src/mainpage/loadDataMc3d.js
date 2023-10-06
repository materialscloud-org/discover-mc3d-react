import { REST_API_COMPOUNDS, REST_API_METADATA } from "../common/config";

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
function columns(info) {
  return [
    {
      field: "id",
      headerName: "ID",
      colType: "text",
      infoText: "The unique MC3D identifier of each structure.",
    },
    {
      field: "formula",
      headerName: "Formula",
      colType: "text",
      // width: 180,
      infoText: "The full formula in Hill notation.",
    },
    {
      field: "n_elem",
      headerName: "Num. of elements",
      colType: "integer",
      hide: true,
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
      infoText: "International short symbol for the space group.",
    },
    {
      field: "spg_num",
      headerName: "Space group number",
      colType: "integer",
      hide: true,
    },
    {
      field: "is_theoretical",
      headerName: "Is source theoretical?",
      colType: "text",
      infoText:
        "Does the source database report the structure origin as theoretical?",
      hide: true,
    },
    {
      field: "is_high_pressure",
      headerName: "Is source high pressure?",
      colType: "text",
      infoText:
        "Does the source database report the characterization pressure higher than " +
        `${info["high_pressure_threshold"]["value"]} ${info["high_pressure_threshold"]["units"]}?`,
      hide: true,
    },
    {
      field: "is_high_temperature",
      headerName: "Is source high temperature?",
      colType: "text",
      infoText:
        "Does the source database report the characterization temperature higher than " +
        `${info["high_temperature_threshold"]["value"]} ${info["high_temperature_threshold"]["units"]}?`,
      hide: true,
    },
    {
      field: "tot_mag",
      headerName: "Total magnetization",
      unit: info["total_magnetization"]["units"],
      colType: "float",
    },
    {
      field: "abs_mag",
      headerName: "Absolute magnetization",
      unit: info["absolute_magnetization"]["units"],
      colType: "float",
    },
  ];
}

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
  let rows = [];

  // for testing a small subset:
  // entries = {
  //   "mc3d-10": entries["mc3d-10"],
  //   "mc3d-228": entries["mc3d-228"],
  //   "mc3d-10010": entries["mc3d-10010"],
  //   "mc3d-10019": entries["mc3d-10019"],
  //   "mc3d-10802": entries["mc3d-10802"],
  //   "mc3d-75049": entries["mc3d-75049"],
  // };

  Object.keys(entries).forEach((i) => {
    let comp = entries[i];
    let elemArr = calcElementArray(comp["formula"]);

    let is_theoretical = false;
    let is_high_pressure = false;
    let is_high_temperature = false;
    if ("flg" in comp) {
      if (comp["flg"].includes("th")) is_theoretical = true;
      if (comp["flg"].includes("hp")) is_high_pressure = true;
      if (comp["flg"].includes("ht")) is_high_temperature = true;
    }

    Object.keys(comp["xc"]).forEach((func) => {
      let mc3d_id = `${i}/${func}`;
      let row = {
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
        is_theoretical: is_theoretical ? "yes" : "no",
        is_high_pressure: is_high_pressure ? "yes" : "no",
        is_high_temperature: is_high_temperature ? "yes" : "no",
      };
      rows.push(row);
    });
  });
  return rows;
}

export async function loadDataMc3d() {
  const index_response = await fetch(REST_API_COMPOUNDS, { method: "get" });
  const index_json = await index_response.json();

  const metadata_response = await fetch(REST_API_METADATA, { method: "get" });
  const metadata_json = await metadata_response.json();

  // return a Promise of the correctly formatted data
  return {
    columns: columns(metadata_json.data),
    rows: formatRows(index_json.data),
  };
}

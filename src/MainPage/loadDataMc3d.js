import { loadIndex, loadMetadata } from "../common/restApiUtils";

import {
  spaceGroupSymbols,
  bravaisLatticeFromSpgn,
} from "../common/symmetryUtils";

import { countNumberOfAtoms } from "../common/utils";

// Order the columns and define which ones to show by default
// refer to the label/field of the column
// columns not listed, will be not shown by default and placed at the bottom
const COLUMN_ORDER_AND_HIDE = [
  ["id", false],
  ["formula", false],
  ["num_elements", false],
  ["num_atoms", false],
  ["bravais_lat", true],
  ["spacegroup_number", false],
  ["spacegroup_int", true],
  ["is_theoretical", false],
  ["is_high_pressure", false],
  ["is_high_temperature", false],
  ["total_magnetization", false],
  ["absolute_magnetization", true],
];

const FRONTEND_COLUMNS = [
  {
    columnDef: {
      field: "num_atoms",
      headerName: "Num. of atoms/cell",
      colType: "integer",
    },
    calcFunc: (entry) => countNumberOfAtoms(entry["formula"]),
  },
  {
    columnDef: {
      field: "bravais_lat",
      headerName: "Bravais lattice",
      colType: "text",
      infoText: "Bravais lattice in Pearson notation.",
    },
    calcFunc: (entry) => bravaisLatticeFromSpgn(entry["sg"]),
  },
  {
    columnDef: {
      field: "spacegroup_int",
      headerName: "Space group international",
      colType: "spg_symbol",
      infoText: "International short symbol for the space group.",
    },
    calcFunc: (entry) => spaceGroupSymbols[entry["sg"]],
  },
];

function formatColumns(metadata) {
  /*
  The column definitions of the MaterialsSelector need to follow the format of
  
  {
    field: str,        // Internal label for the column
    headerName: str,   // Column title displayed in header
    unit: str,         // unit displayed in header
    colType: str,      // type that determines formatting & filtering, see below
    infoText: str,     // info text in the header menu
    hide: bool,        // whether to hide the column by default
  },

  Possible colTypes:
    * "id" - always on the left; and href to the detail page;
    * "formula" - special formatting with subscripts
    * "spg_symbol" - special formatting
    * "text"
    * "integer"
    * "float"
    * ...
  */
  let columns = [
    {
      field: "id",
      headerName: "ID",
      colType: "id",
      infoText: "The unique MC3D identifier of each structure.",
    },
  ];

  // convert the columns from metadata
  metadata["index-columns"].forEach((col) => {
    columns.push({
      field: col.label,
      headerName: col.name,
      unit: col.unit || null,
      colType: col.type || "text",
      infoText: col.description || null,
    });
  });

  // Add frontend columns
  FRONTEND_COLUMNS.forEach((frontCol) => {
    columns.push(frontCol.columnDef);
  });

  console.log(columns);

  // order and hide columns
  let orderedColumns = [];
  COLUMN_ORDER_AND_HIDE.forEach(([field, hide]) => {
    let colIndex = columns.findIndex((col) => col.field === field);
    if (colIndex !== -1) {
      let col = columns[colIndex];
      col.hide = hide;
      orderedColumns.push(col);
      // Remove the column from the array
      columns.splice(colIndex, 1);
    }
  });
  columns.forEach((col) => {
    col.hide = true;
    orderedColumns.push(col);
  });

  return orderedColumns;
}

function formatRows(indexData, metadata, method) {
  /*
  The row data for the MaterialsSelector needs to contain
    * key-value for each column definition (key = "field" of the column);
    * 'href' - this link is added to the id column;

  The raw index data from the API needs:
  * href
  * mapping the short data_label to label/field of columns
  * calculating the frontend columns
  */
  let rows = [];

  let labelMap = {};
  metadata["index-columns"].forEach((col) => {
    labelMap[col.data_label] = col.label;
  });

  // for testing a small subset:
  // indexData = indexData.slice(0, 10);

  indexData.forEach((entry) => {
    // console.log(entry);
    let id = `${entry["id"]}/${method}`;
    let href = `${import.meta.env.BASE_URL}#/details/${id}`;

    let row = {};
    Object.entries(entry).map(([key, value]) => {
      if (key in labelMap) {
        row[labelMap[key]] = value;
      }
    });

    let modifiedKeys = {
      id: id,
      href: href,
    };

    FRONTEND_COLUMNS.forEach((frontCol) => {
      modifiedKeys[frontCol.columnDef.field] = frontCol.calcFunc(entry);
    });

    row = { ...row, ...modifiedKeys };

    rows.push(row);
  });
  return rows;
}

export async function loadDataMc3d(method) {
  let start = performance.now();
  let indexData = await loadIndex(method);
  let end = performance.now();
  console.log(`loadIndex: ${end - start} ms`);

  start = performance.now();
  let metadata = await loadMetadata(method);
  end = performance.now();
  console.log(`loadMetadata: ${end - start} ms`);

  start = performance.now();
  let rows = formatRows(indexData, metadata, method);
  end = performance.now();
  console.log(`formatRows: ${end - start} ms`);

  let columns = formatColumns(metadata);

  // console.log(rows);
  // console.log(columns);

  // return a Promise of the correctly formatted data
  return {
    columns: columns,
    rows: rows,
  };
}

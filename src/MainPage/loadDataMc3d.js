import { loadIndex, loadMetadata } from "../common/restApiUtils";

import {
  spaceGroupSymbols,
  bravaisLatticeFromSpgn,
} from "../common/symmetryUtils";

import { countNumberOfAtoms, calcElementArray } from "../common/utils";

const FRONTEND_COLUMNS = [
  {
    columnDef: {
      field: "n_atoms",
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
      field: "spg_int",
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

  Possible colTypes are the following (specific ones first, more general later):
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
      field: col.short_label,
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

  return columns;
}

function formatRows(indexData, method) {
  /*
  The row data for the MaterialsSelector needs to contain
    * key-value for each column definition (key = "field" of the column);
    * 'href' - this link is added to the id column;

  Most of the index data should already be in the correct format,
  except for href and any frontend-calculated columns.
  */
  let rows = [];

  // for testing a small subset:
  // indexData = indexData.slice(0, 10);

  indexData.forEach((entry) => {
    // console.log(entry);
    let id = `${entry["id"]}/${method}`;
    let elemArr = calcElementArray(entry["formula"]);
    let href = `${import.meta.env.BASE_URL}/#/details/${id}`;

    let modifiedKeys = {
      id: id,
      elem_array: elemArr,
      href: href,
    };

    FRONTEND_COLUMNS.forEach((frontCol) => {
      modifiedKeys[frontCol.columnDef.field] = frontCol.calcFunc(entry);
    });

    let row = { ...entry, ...modifiedKeys };

    rows.push(row);
  });
  return rows;
}

export async function loadDataMc3d() {
  let method = "pbe-v1";

  let index_data = await loadIndex(method);
  let metadata = await loadMetadata(method);

  let rows = formatRows(index_data, method);
  let columns = formatColumns(metadata);

  // console.log(rows);
  // console.log(columns);

  // return a Promise of the correctly formatted data
  return {
    columns: columns,
    rows: rows,
  };
}

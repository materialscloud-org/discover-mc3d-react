// Helper file for table configuration from urls.

// Define presets here.
export const PRESETS = {
  MinTable: {
    sort: "num_atoms:desc,num_elements:desc",
    hiddenColumns: ["spacegroup_number", "id", "formula"],
  },
  superconductivity: {
    sort: "isotropic_tc:desc",
    hiddenColumns: [
      "is_high_pressure",
      "is_theoretical",
      "num_elements",
      "total_magnetization",
      "is_high_temperature",
    ],
    showColumns: ["isotropic_tc", "highest_phonon_frequency"],
  },
};

/*
Parses column configuration parameters from the URL search params
into a format that the AGgrid api can deal with

example URL strings:
 ?sort=num_atoms:desc,num_elements:asc&hide=id,formula
 ?preset=MinTable

 */
export function getColumnConfigFromUrl(urlSearchParams, presets) {
  const sortParam = urlSearchParams.get("sort");
  const hideParam = urlSearchParams.get("hide");
  const showParam = urlSearchParams.get("show");
  const presetParam = urlSearchParams.get("preset");

  let sortEntries = [];
  let hiddenFields = [];
  let showFields = [];

  if (presetParam && presets[presetParam]) {
    const preset = presets[presetParam];
    sortEntries = preset.sort
      ? preset.sort.split(",").map((entry, idx) => {
          const [field, dir] = entry.split(":");
          return { field, sort: dir, sortIndex: idx };
        })
      : [];
    hiddenFields = preset.hiddenColumns || [];
    showFields = preset.showColumns || [];
  } else {
    sortEntries = sortParam
      ? sortParam.split(",").map((entry, idx) => {
          const [field, dir] = entry.split(":");
          return { field, sort: dir, sortIndex: idx };
        })
      : [];
    hiddenFields = hideParam ? hideParam.split(",") : [];
    showFields = showParam ? showParam.split(",") : [];
  }

  return { sortEntries, hiddenFields, showFields };
}

// applies the column state to a given set of columns
export function applyColumnStateFromUrl(
  columns,
  sortEntries,
  hiddenFields,
  showFields,
) {
  console.log(showFields);
  return columns.map((col) => {
    const updatedCol = { ...col };
    const match = sortEntries.find((s) => s.field === col.field);
    if (match) {
      updatedCol.sort = match.sort;
      updatedCol.sortIndex = match.sortIndex;
    }

    if (hiddenFields.includes(col.field)) {
      console.log("hiding", col);
      updatedCol.hide = true;
    } else if (showFields.includes(col.field)) {
      console.log("showing", col);
      updatedCol.hide = false;
    }

    return updatedCol;
  });
}

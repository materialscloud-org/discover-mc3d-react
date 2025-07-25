// Helper file for table configuration from urls.

// Define presets here.
export const PRESETS = {
  MinTable: {
    sort: "num_atoms:desc,num_elements:desc",
    hiddenColumns: ["spacegroup_number", "id", "formula"],
  },
  superconductivity: {
    hiddenColumns: ["is_source_high_pressure"],
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

// applies the column state to a given set of columns
export function applyColumnStateFromUrl(columns, sortEntries, hiddenFields) {
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

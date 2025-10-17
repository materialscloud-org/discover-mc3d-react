// Helper file for table configuration from urls.

// Define presets here - these toggle everything else off by default
// Allows applying a method, but this can be overwritten with &method=...
export const PRESETS = {
  superconductivity: {
    sort: "isotropic_tc:desc",
    method: "pbesol-v1",
    showColumns: [
      "id",
      "formula",
      "num_atoms",
      "spacegroup_int",
      "isotropic_tc",
      "anisotropic_tc",
      "allen_dynes_tc",
      "highest_phonon_frequency",
    ],
  },
};

/*
Parses column configuration parameters from the URL search params
into a format that the AGgrid api can deal with

example URL strings:
 ?sort=num_atoms:desc,num_elements:asc&hide=id,formula
 ?preset=superconductivity
 */
function getColumnConfigFromUrlParams(urlSearchParams) {
  const sortParam = urlSearchParams.get("sort");
  const showParam = urlSearchParams.get("show");
  const hideParam = urlSearchParams.get("hide");
  const presetParam = urlSearchParams.get("preset");

  let sortEntries = [];
  let showFields = [];
  let hiddenFields = [];

  // If preset exists, apply it and ignore show/hide params
  if (presetParam && PRESETS[presetParam]) {
    const preset = PRESETS[presetParam];
    sortEntries = parseSortParam(preset.sort);
    showFields = preset.showColumns || [];
    console.log("showFields", showFields);
    // By convention: hide everything not in showColumns
    hiddenFields = null; // signal to hide all except showFields
  } else {
    // Use explicit show/hide
    if (showParam) {
      showFields = showParam.split(",");
    }
    if (hideParam) {
      hiddenFields = hideParam.split(",");
    }
    sortEntries = parseSortParam(sortParam);
  }

  return { sortEntries, showFields, hiddenFields };
}

function parseSortParam(sortStr) {
  if (!sortStr) return [];
  return sortStr.split(",").map((entry, idx) => {
    const [field, dir] = entry.split(":");
    return {
      field,
      sort: dir || "asc",
      sortIndex: idx,
    };
  });
}

// Applies the column state to a given set of columns
function updateColumnState(columns, sortEntries, hiddenFields, showFields) {
  const isPresetMode = hiddenFields === null;

  return columns.map((col) => {
    const updatedCol = { ...col };

    // Apply sorting
    const match = sortEntries.find((s) => s.field === col.field);
    if (match) {
      updatedCol.sort = match.sort;
      updatedCol.sortIndex = match.sortIndex;
    }

    // Preset mode: hide everything not in showFields
    if (isPresetMode) {
      updatedCol.hide = !showFields.includes(col.field);
    } else {
      // Manual override mode: hide/show explicitly
      if (hiddenFields.includes(col.field)) {
        updatedCol.hide = true;
      } else if (showFields.includes(col.field)) {
        updatedCol.hide = false;
      }
      // else: keep current `hide` value
    }

    return updatedCol;
  });
}

export function getMethodFromPreset(presetName) {
  if (!presetName) return null;
  const preset = PRESETS[presetName];
  if (!preset) {
    return null;
  }
  return preset.method;
}

export function getMethodFromUrl(urlParams, defaultMethod) {
  const methodFromUrl = urlParams.get("method");

  if (methodFromUrl) {
    return methodFromUrl;
  }

  // If no method in URL, check preset from URL
  const presetName = urlParams.get("preset");
  if (presetName && PRESETS[presetName] && PRESETS[presetName].method) {
    return PRESETS[presetName].method;
  }

  return defaultMethod;
}

export function updateColumnsFromUrl(columns, urlParams) {
  const { sortEntries, hiddenFields, showFields } =
    getColumnConfigFromUrlParams(urlParams);

  const newColumns = updateColumnState(
    columns,
    sortEntries,
    hiddenFields,
    showFields,
  );

  return newColumns;
}

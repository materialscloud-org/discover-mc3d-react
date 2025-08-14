// trace Configurations for supercon data.
export const traceConfigs = {
  electronicEPW: {
    label: "EPW",
    colors: ["#d62728"],
    dash: "4px",
    width: 1.75,
    opacity: 1,
    units: "eV",
    mode: "markers",
    marker: { size: 3, color: "red" },
  },
  electronicQE: {
    label: "QE",
    colors: ["#6baed6"],
    dash: "solid",
    width: 2.25,
    opacity: 0.95,
    units: "eV",
    mode: "markers",
    marker: { size: 3, color: "blue" },
  },
  phononEPW: {
    label: "EPW Phonons",
    colors: ["#d62728"],
    dash: "4px",
    width: 1.75,
    opacity: 1,
    units: "eV",
    mode: "markers",
    marker: { size: 3, color: "red" },
  },

  unknownEntry: {
    label: "Unknown Data 1",
    colors: ["#2ca02c", "#98df8a"],
    dash: "dot",
    units: "eV",
  },
};

export const SUPERCON_EEPW_TRACE_CONFIG = {
  label: "EPW",
  colors: ["#d62728", "#ff9896"],
  dash: "4px",
  width: 1.75,
  opacity: 1,
  units: "eV",
};

export const SUPERCON_EQE_TRACE_CONFIG = {
  label: "QE",
  colors: ["#1f77b4", "#6baed6"], // Down, Up
  dash: "solid",
  width: 2.25,
  opacity: 0.95,
  units: "eV",
};

const SUPERCON_BANDS_TRACE_CONFIG = [
  {
    label: "QE",
    colors: ["#1f77b4", "#6baed6"], // Down, Up
    dash: "solid",
    width: 2.25,
    opacity: 0.95,
    units: "eV",
  },
  {
    label: "EPW",
    colors: ["#d62728", "#ff9896"],
    dash: "4px",
    width: 1.75,
    opacity: 1,
    units: "eV",
  },
  {
    label: "Unknown Data 1",
    colors: ["#2ca02c", "#98df8a"],
    dash: "dot",
    units: "eV",
  },
  {
    label: "Unknown Data 2",
    colors: ["#9467bd", "#c5b0d5"],
    dash: "dashdot",
    units: "eV",
  },
];

export const SUPERCON_BANDS_LAYOUT_CONFIG = {
  yaxis: {
    showline: false,
    showgrid: false,
    range: [-5.4, 5.4],
    title: {
      text: "Energy [eV]",
    },
  },
  legend: {
    orientation: "v",
    y: 0.975,
    x: 0.975,
    xanchor: "right",
    font: { size: 14, color: "#333" },

    bgcolor: "rgba(250, 250, 250, 1.0)",
    bordercolor: "#ccc",
    borderwidth: 1,
  },
  shapes: [
    // the default border is a bit too thick
    {
      type: "rect",
      xref: "paper",
      yref: "paper",
      x0: 0,
      y0: 0,
      x1: 1,
      y1: 1,
      line: { color: "black", width: 1.25 },
      layer: "above",
    },
  ],
};

const SUPERCON_PHONON_TRACE_CONFIG = [
  {
    label: "DFT Phonons",
    colors: ["#1f77b4", "#6baed6"], // Down, Up
    dash: "solid",
    units: "meV",
  },
];

const SUPERCON_PHONON_LAYOUT_CONFIG = {
  margin: { t: 10, b: 50, l: 52, r: 0 },
  yaxis: {
    zeroline: false,
    showline: false,
    showgrid: false,
    title: {
      text: "Frequency [meV]",
    },
    rangemode: "nonnegative",
  },
  legend: {
    visible: false,
  },
  shapes: [
    // the default border is a bit too thick
    {
      type: "rect",
      xref: "paper",
      yref: "paper",
      x0: 0,
      y0: 0,
      x1: 1,
      y1: 1,
      line: { color: "black", width: 1.25 },
      layer: "above",
    },
  ],
};

export const CONFIG_MAP = {
  "supercon-bands-wannier": {
    traces: SUPERCON_BANDS_TRACE_CONFIG,
    layout: SUPERCON_BANDS_LAYOUT_CONFIG,
  },
  "supercon-phonon-wannier": {
    traces: SUPERCON_PHONON_TRACE_CONFIG,
    layout: SUPERCON_PHONON_LAYOUT_CONFIG,
  },
};

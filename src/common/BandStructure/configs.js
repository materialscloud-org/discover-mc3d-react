// configuration files used to hack the BS visualiser defaults.
const SUPERCON_BANDS_TRACE_CONFIG = [
  {
    label: "DFT",
    colors: ["#1f77b4", "#6baed6"], // Down, Up
    dash: "solid",
  },
  {
    label: "Wannier",
    colors: ["#d62728", "#ff9896"],
    dash: "dash",
  },
  {
    label: "Unknown Data 1",
    colors: ["#2ca02c", "#98df8a"],
    dash: "dot",
  },
  {
    label: "Unknown Data 2",
    colors: ["#9467bd", "#c5b0d5"],
    dash: "dashdot",
  },
];

const SUPERCON_BANDS_LAYOUT_CONFIG = {
  xaxis: {
    showticklabels: false,
    ticks: "",
    showline: false,
    showgrid: false,
  },
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

    title: {
      font: { size: 14, color: "#333" },
    },

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
      line: { color: "black", width: 1.0 },
      layer: "above",
    },
  ],
};

const SUPERCON_PHONON_TRACE_CONFIG = [
  {
    label: "DFT Phonons",
    colors: ["#1f77b4", "#6baed6"], // Down, Up
    dash: "solid",
  },
];

const SUPERCON_PHONON_LAYOUT_CONFIG = {
  xaxis: {
    showticklabels: false,
    ticks: "",
    showline: false,
    showgrid: false,
  },
  yaxis: {
    showline: false,
    showgrid: false,
    title: {
      text: "Frequency [Thz]",
    },
  },
  legend: {
    orientation: "v",
    y: 0.975,
    x: 0.975,
    xanchor: "right",

    title: {
      font: { size: 14, color: "#333" },
    },

    font: { size: 14, color: "#333" },

    bgcolor: "rgba(250, 250, 250, 0.8)",
    alpha: 0.4,
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
      line: { color: "black", width: 1.0 },
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

// configurations for use in the prepSuperconbands
// some of these are hacks and will be removed
// when a new release of the bandsvisualiser is done
export const traceConfigs = {
  electronicEPW: {
    label: "EPW",
    colors: ["#d62728"],
    dash: "4px",
    width: 1.75,
    opacity: 1,
    units: "eV",
  },
  electronicQE: {
    label: "QE",
    colors: ["#6baed6"],
    dash: "solid",
    width: 2.25,
    opacity: 0.95,
    units: "eV",
  },
  phononEPW: {
    label: "EPW",
    colors: ["#d62728"],
    dash: "solid",
    width: 1.75,
    opacity: 1,
    units: "eV",
    showlegend: false,
  },

  unknownEntry: {
    label: "Unknown Data 1",
    colors: ["#2ca02c", "#98df8a"],
    dash: "dot",
    units: "eV",
  },
};

export const COMMON_LAYOUT_CONFIG = {
  // Common Y-axis settings
  yaxis: {
    showgrid: false,
    showline: false,
    ticks: "inside",
    tickfont: { size: 14, color: "#333" },
    title: { font: { size: 16, color: "#333" }, standoff: 10 },
    // Do NOT set 'tickvals' or 'ticktext' here
  },

  // Common X-axis settings
  xaxis: {
    showgrid: true,
    ticks: "inside",
    tickfont: { size: 14, color: "#333" },
    title: { font: { size: 16, color: "#333" } },
    // No tickvals/ticktext
  },

  // Legend defaults
  legend: {
    orientation: "v",
    y: 0.985,
    x: 0.985,
    xanchor: "right",
    font: { size: 14, color: "#333" },
    bgcolor: "rgba(250, 250, 250, 1.0)",
    bordercolor: "#ccc",
    borderwidth: 1,
  },

  margin: { l: 65, r: 10, t: 0, b: 50 },

  shapes: [
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

// layout for bands
export const SUPERCON_BANDS_LAYOUT_CONFIG = {
  ...COMMON_LAYOUT_CONFIG,
  yaxis: {
    ...COMMON_LAYOUT_CONFIG.yaxis,
    title: { ...COMMON_LAYOUT_CONFIG.yaxis.title, text: "Energy [eV]" },
  },
};

export const SUPERCON_PHONON_A2F_LAYOUT_CONFIG = {
  ...COMMON_LAYOUT_CONFIG,
  margin: { l: 65, r: 10, t: 50, b: 50 },

  yaxis: {
    ...COMMON_LAYOUT_CONFIG.yaxis,
    title: { ...COMMON_LAYOUT_CONFIG.yaxis.title, text: "Energy [meV]" },
    autorange: false,
    rangemode: "nonnegative",
  },
  yaxis2: {
    matches: "y",
    showticklabels: false,
    ticks: "inside",
    showgrid: false,
    rangemode: "nonnegative",
    autorange: false,
    zeroline: false,
  },
  xaxis: {
    ticks: "inside",
    tickfont: { size: 14, color: "#333" },
    title: { text: "q-path", font: { size: 16, color: "#333" } },
    // No tickvals/ticktext
  },

  xaxis2: {
    ...COMMON_LAYOUT_CONFIG.xaxis,
    title: { ...COMMON_LAYOUT_CONFIG.xaxis.title, text: "α<sup>2</sup>F(ω)" },
    showgrid: false,
  },
  xaxis3: {
    overlaying: "x2",
    side: "top",
    anchor: "y",
    title: {
      text: "λ(ω)",
      font: { size: 16 },
    },
    showgrid: false,
    tickfont: { size: 15, color: "#333" },
    ticks: "inside",
    tickmode: "auto",
  },
  legend2: {
    orientation: "v",
    y: 0.1,
    x: 0.585,
    xanchor: "right",
    zorder: -100,
    opacity: 0,
    bgcolor: "rgba(0, 0, 0, 0)",
  },

  // Default border shape
  shapes: [
    {
      type: "rect",
      xref: "paper",
      yref: "paper",
      x0: 0,
      y0: 0,
      x1: 0.7,
      y1: 1,
      line: { color: "black", width: 1.25 },
      layer: "above",
    },
    {
      type: "rect",
      xref: "paper",
      yref: "paper",
      x0: 0.73,
      y0: 0,
      x1: 1,
      y1: 1,
      line: { color: "black", width: 1.25 },
      layer: "above",
    },
  ],
};

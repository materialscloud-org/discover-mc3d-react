import React, { useRef, useEffect } from "react";
import Plotly from "plotly.js-dist-min"; // or "plotly.js-basic-dist"

const GAP_TRACE_CONFIG = {
  color: "#d62728",
  dash: "solid",
  label: "Gap function label",
  lineWidth: 1.75,
  units: "Units?",
};

const VERT_LINE_CONFIG = {
  color: "#111",
};

const GAP_LAYOUT_CONFIG = {
  xaxis: {
    title: {
      text: "T [K]",
      font: { size: 18, color: "#111" },
    },
    tickfont: { size: 20 },
    showgrid: false,
    zeroline: false,
    showline: false,
    ticks: "inside",
  },
  yaxis: {
    title: {
      text: "∆<sub>nk</sub> [meV]",
      font: { size: 18, color: "#111" },
    },
    tickfont: { size: 20 },
    showgrid: false,
    zeroline: false,
    showline: false,
    ticks: "inside",
    rangemode: "nonnegative",
  },
  legend: {
    visible: false,
  },
  margin: { t: 10, b: 50, l: 52, r: 0 },
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

function createAnalyticGapTrace(
  delta_zero,
  p,
  Tc,
  resolution = 200,
  label = "Analytical Δ(T)",
) {
  // Generate T values from 0 to Tc
  const tvals = Array.from(
    { length: resolution },
    (_, i) => (i * Tc) / (resolution - 1),
  );

  // Compute Δ(T) using the fit function
  const yvals = tvals.map(
    (T) => delta_zero * Math.sqrt(1 - Math.pow(T / Tc, p)),
  );

  return {
    x: tvals,
    y: yvals,
    name: label,
    type: "scatter",
    mode: "lines",
    line: { color: "red", dash: "dash" },
  };
}

export default function GapPlot({
  gapfuncData,
  Tc,
  verts,
  points,
  delta0,
  expo,
  resolution = 100,
}) {
  const plotRef = useRef(null);

  console.log("gap", gapfuncData);

  useEffect(() => {
    if (!gapfuncData) return;

    // get traces from gap func
    const traces = Object.entries(gapfuncData)
      .filter(([key, val]) => Array.isArray(val)) // only arrays
      .map(([label, arr]) => ({
        x: arr.map((a) => a[0]), // first element of each pair
        y: arr.map((a) => a[1]), // second element of each pair
        label: `${GAP_TRACE_CONFIG.label}`,
        name: `${GAP_TRACE_CONFIG.label}`,
        hovertemplate: `<b>${GAP_TRACE_CONFIG.label}</b>: YVAL: %{y:.3f} XVAL:%{x:.3f} UNITS:${GAP_TRACE_CONFIG.units}<br><extra></extra>`,
        type: "scatter",
        mode: "lines",
        line: {
          color: GAP_TRACE_CONFIG.color,
        },
      }));

    // get points as traces too.
    // Traces for points
    const pointTraces = (verts || []).map((x, i) => ({
      x: [x],
      y: [(points || [])[i]], // take y from points array
      name: `point ${i}`,
      type: "scatter",
      mode: "markers",
      marker: { color: "#d62728", size: 12 },
    }));

    traces.push(...pointTraces);

    // add the fitted curve.
    const curveTrace = createAnalyticGapTrace(delta0, expo, Tc, resolution);

    console.log("cT", curveTrace);

    traces.push(curveTrace);

    let layoutWithVerts;
    if (verts && verts.length) {
      const minX = Math.min(...verts) - 1.5;
      const maxX = Math.max(...verts) + 1.5;

      layoutWithVerts = {
        ...GAP_LAYOUT_CONFIG,
        xaxis: {
          ...GAP_LAYOUT_CONFIG.xaxis,
          range: [minX, maxX], // set x-axis limits
        },
        shapes: [
          ...(GAP_LAYOUT_CONFIG.shapes || []),
          ...verts.map((x) => ({
            type: "line",
            x0: x,
            x1: x,
            y0: 0,
            y1: 1,
            yref: "paper", // still spans full y-axis
            line: { color: "#111", width: 1.25 },
          })),
        ],
      };
    } else {
      layoutWithVerts = GAP_LAYOUT_CONFIG;
    }

    // Render the plot
    Plotly.newPlot(plotRef.current, traces, layoutWithVerts, {
      responsive: true,
    });

    console.log("traces", traces);
    console.log("gp", gapfuncData);

    // Optional cleanup on unmount
    return () => Plotly.purge(plotRef.current);
  }, [gapfuncData]);

  return <div ref={plotRef} style={{ width: "100%", height: "500px" }} />;
}

import { useRef, useEffect } from "react";
import Plotly from "plotly.js-dist-min"; // or "plotly.js-basic-dist"

const GAP_TRACE_CONFIG = {
  color: "#d62728",
  dash: "solid",
  label: "Gap function label",
  lineWidth: 1.75,
  units: "Units?",
};

const GAP_LAYOUT_CONFIG = {
  xaxis: {
    title: {
      text: "T [K]",
      font: { size: 17, color: "#111" },
    },
    tickfont: { size: 15 },
    showgrid: false,
    zeroline: false,
    showline: false,
    ticks: "inside",
  },
  yaxis: {
    title: {
      text: "Δ<sub>n<b>k</b></sub>(T) [meV]",
      font: { size: 17, color: "#111" },
    },
    tickfont: { size: 15 },
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
    hovertemplate:
      "<b>BCS fitted equation:</b>: <b>x:</b> %{x:.3f}, <b>y:</b> %{y:.3f}<b></b><extra></extra>",
    line: { color: "#b22222", dash: "dash" },
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
  minXVal = 0,
  maxXVal = null,
  minYVal = null,
  maxYVal = 0,
}) {
  const plotRef = useRef(null);

  useEffect(() => {
    if (!gapfuncData) return;

    const safeVerts = verts ?? [];

    // get traces from gap funcData
    const traces = Object.entries(gapfuncData)
      .filter(([key, val]) => Array.isArray(val))
      .map(([label, arr]) => {
        const xVals = arr.map(([x, y]) => x);
        const yVals = arr.map(([x, y]) => y);

        // z = distance to nearest vert
        const customdata = xVals.map((x) => {
          // only consider verts to the left of x
          const leftVerts = safeVerts.filter((v) => v <= x);
          if (!leftVerts.length) return null;
          const leftVert = Math.max(...leftVerts);
          return [x - leftVert];
        });

        return {
          x: xVals,
          y: yVals,
          customdata,
          type: "scatter",
          mode: "lines",
          line: { color: GAP_TRACE_CONFIG.color },
          hovertemplate:
            "<b>T</b>: %{x:.3f} K<br><b>Fit of BCS gap:</b> %{y:.3f}<br><b>Histogram of Δ<sub>n<b>k</b></sub>(0)</b>: %{customdata:.3f}<extra></extra>",
        };
      });

    // Markers for points
    const pointTraces = (verts || []).map((x, i) => ({
      x: [x],
      y: [(points || [])[i]], // take y from points array
      name: `point ${i}`,
      type: "scatter",
      mode: "markers",
      hovertemplate:
        "<b>Weighted average at %{x:.0f}K:</b> %{y:.3f}<extra></extra>",
      marker: { color: GAP_TRACE_CONFIG.color, size: 12 },
    }));

    traces.push(...pointTraces);

    // add the fitted curve.
    const curveTrace = createAnalyticGapTrace(delta0, expo, Tc, resolution);
    traces.push(curveTrace);

    let layoutWithVerts = {
      ...GAP_LAYOUT_CONFIG,
      xaxis: {
        ...GAP_LAYOUT_CONFIG.xaxis,
        range:
          minXVal != null && maxXVal != null ? [minXVal, maxXVal] : undefined,
      },
      yaxis: {
        ...GAP_LAYOUT_CONFIG.yaxis,
        range:
          minYVal != null && maxYVal != null ? [minYVal, maxYVal] : undefined,
      },
      shapes: [
        ...(GAP_LAYOUT_CONFIG.shapes || []),
        ...safeVerts.map((x) => ({
          type: "line",
          x0: x,
          x1: x,
          y0: 0,
          y1: 1,
          yref: "paper",
          line: { color: "#111", width: 1.25 },
          layer: "below",
        })),
      ],
    };

    // Render the plot
    Plotly.newPlot(plotRef.current, traces, layoutWithVerts, {
      responsive: true,
    });

    console.log("gp", gapfuncData);

    return () => Plotly.purge(plotRef.current);
  }, [gapfuncData]);

  return <div ref={plotRef} style={{ width: "100%", height: "500px" }} />;
}

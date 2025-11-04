import { useRef, useEffect } from "react";
import { McloudSpinner } from "mc-react-library";
import Plotly from "plotly.js-basic-dist-min";

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
      font: { size: 15, color: "#111" },
    },
    tickfont: { size: 14 },
    showgrid: false,
    zeroline: false,
    showline: false,
    ticks: "inside",
    rangemode: "nonnegative",
  },
  yaxis: {
    title: {
      text: "Δ<sub>n<b>k</b></sub>(T) [meV]",
      font: { size: 15, color: "#111" },
    },
    tickfont: { size: 14 },
    showgrid: false,
    zeroline: false,
    showline: false,
    ticks: "inside",
    rangemode: "nonnegative",
  },
  legend: {
    visible: false,
  },
  margin: { t: 10, b: 40, l: 65, r: 2 },
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
      "<b>Value of the fit of BCS gap at %{x:.2f}K:</b> %{y:.3f}<extra></extra>",
    line: { color: "#b22222", dash: "dash" },
  };
}

export default function GapFunction({
  gapfuncData,
  loading = false,
  loadingIconScale = 8,
  Tc,
  verts,
  points,
  delta0,
  expo,
  resolution = 1000,
  minXVal = 0,
  maxXVal = null,
  minYVal = null,
  maxYVal = 0,
}) {
  const plotRef = useRef(null);

  useEffect(() => {
    if (!gapfuncData || !plotRef.current || loading) return;

    const plotElement = plotRef.current;
    const safeVerts = verts ?? [];

    // build traces
    const traces = Object.entries(gapfuncData)
      .filter(([val]) => Array.isArray(val))
      .map(([arr]) => {
        const xVals = arr.map(([x]) => x);
        const yVals = arr.map(([y]) => y);

        // compute leftVert and distance
        const { leftVerts, distances } = xVals.reduce(
          (acc, x) => {
            const candidates = safeVerts.filter((v) => v <= x);
            if (!candidates.length) {
              acc.leftVerts.push(null);
              acc.distances.push(null);
            } else {
              const leftVert = Math.max(...candidates);
              acc.leftVerts.push(leftVert);
              acc.distances.push(x - leftVert);
            }
            return acc;
          },
          { leftVerts: [], distances: [] },
        );

        return {
          x: xVals,
          y: yVals,
          customdata: distances, // x - leftVert distances
          text: leftVerts, // attach leftVert values here
          type: "scatter",
          mode: "lines",
          line: { color: GAP_TRACE_CONFIG.color },
          hovertemplate:
            "<b>Histogram of Δ<sub>nk</sub>(%{text:.1f}K) at %{y:.2f} meV:</b> %{customdata:.2f} <extra></extra>",
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

    const layoutWithVerts = {
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
    Plotly.newPlot(plotElement, traces, layoutWithVerts, {
      responsive: true,
    });

    return () => Plotly.purge(plotElement);
  }, [
    gapfuncData,
    verts,
    points,
    delta0,
    expo,
    Tc,
    resolution,
    minXVal,
    maxXVal,
    minYVal,
    maxYVal,
    loading,
  ]);

  return (
    <div
      ref={plotRef}
      style={{
        position: "relative",
        width: "100%",
        height: "450px",
        border: loading ? "2px solid #ccc" : "none",
        borderRadius: loading ? "8px" : "0",
      }}
    >
      {loading && (
        <div
          style={{
            width: `${loadingIconScale}%`,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <McloudSpinner />
        </div>
      )}
    </div>
  );
}

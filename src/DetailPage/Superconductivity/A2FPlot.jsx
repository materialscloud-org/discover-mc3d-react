import { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist-min";

const A2F_TRACE_CONFIG = {
  colors: [
    "#17becf",
    "#bcbd22",
    "#7f7f7f",
    "#e377c2",
    "#8c564b",
    "#9467bd",
    "#d62728",
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
  ], // up to 10 colors
  dash: "solid",
  labelPrefix: "degaussq", // used for trace names
};

const A2F_LAYOUT_CONFIG = {
  xaxis: {
    title: {
      text: "Frequency (ω)",
      font: { size: 18, color: "#111" },
    },
    tickfont: { size: 18 },
    showgrid: false,
    zeroline: false,
    showline: false,
    ticks: "inside",
  },
  yaxis: {
    title: {
      text: "α²F(ω)",
      font: { size: 18, color: "#111" },
    },
    tickfont: { size: 18 },
    showgrid: false,
    zeroline: false,
    showline: false,
    ticks: "inside",
  },

  legend: {
    orientation: "v",
    y: 0.985,
    x: 1.25,
    xanchor: "right",

    font: { size: 14, color: "#333" },

    bgcolor: "rgba(250, 250, 250, 0.8)",
    alpha: 0.4,
    bordercolor: "#ccc",
    borderwidth: 1,
  },
  margin: { t: 10, b: 50, l: 52, r: 40 },
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
      line: { color: "black", width: 1 },
      layer: "above",
    },
  ],
};

export default function A2FPlot({ a2f, frequency, degaussq, lambda }) {
  const plotRef = useRef(null);

  useEffect(() => {
    // If ref is missing, bail out early (no plot)
    if (!plotRef.current) {
      console.warn("Plot ref not ready yet");
      return;
    }

    // If any data missing, clear plot and bail
    if (!a2f || !frequency || !degaussq || !lambda) {
      Plotly.purge(plotRef.current);
      return;
    }

    const traces = degaussq.map((dg, i) => ({
      x: frequency,
      y: a2f.map((row) => row[i]),
      type: "scatter",
      mode: "lines",
      line: {
        color: A2F_TRACE_CONFIG.colors[i % A2F_TRACE_CONFIG.colors.length],
        dash: A2F_TRACE_CONFIG.dash,
        width: 2,
      },
      name: `${A2F_TRACE_CONFIG.labelPrefix}: ${dg.toFixed(4)} | λ: ${lambda[i].toFixed(4)}`,
    }));

    // Compute cumulative lambda(ω)
    const selectedDegaussIndex = 0;
    const deltaFreq = frequency[1] - frequency[0];
    const cumulativeLambda = [];
    let integral = 0;

    for (let j = 0; j < frequency.length; j++) {
      const omega = frequency[j];
      const a2fVal = a2f[j][selectedDegaussIndex];
      if (omega > 0) {
        integral += ((2 * a2fVal) / omega) * deltaFreq;
      }
      cumulativeLambda.push(integral);
    }

    traces.push({
      x: frequency,
      y: cumulativeLambda,
      type: "scatter",
      mode: "lines",
      name: "Cumulative λ(ω)",
      line: {
        color: "black",
        width: 2,
        dash: "dot",
      },
    });

    Plotly.newPlot(plotRef.current, traces, A2F_LAYOUT_CONFIG, {
      responsive: true,
    });

    return () => {
      if (plotRef.current) Plotly.purge(plotRef.current);
    };
  }, [a2f, frequency, degaussq, lambda]);

  return <div ref={plotRef} style={{ width: "100%", height: "500px" }} />;
}

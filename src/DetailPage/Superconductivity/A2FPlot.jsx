import { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist-min";

const A2F_TRACE_CONFIG = {
  color: "#1f77b4",
  dash: "solid",
  label: "A2F data",
  lineWidth: 1.75,
  units: "a2f",
};

const A2F_CUMULATIVE_CONFIG = {
  color: "#111",
  dash: "solid",
  label: "Cumulative a2f",
  lineWidth: 1.75,
  units: "a2f",
};
const A2F_LAYOUT_CONFIG = {
  xaxis: {
    title: {
      text: "a2f",
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
      text: "",
      font: { size: 18, color: "#111" },
    },
    tickfont: { size: 18 },
    showgrid: false,
    zeroline: false,
    showline: false,
    ticks: "inside",
    range: [null, 75],
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

/*
Returns a A2F Plot with freq on y and data on x; 
*/
export default function A2FPlot({
  a2f,
  frequency,
  degaussq,
  lambda,
  selectedDegaussIndex = -1, // -1 means: use the last index
  maxYval = null,
}) {
  const plotRef = useRef(null);

  // plot container check
  useEffect(() => {
    if (!plotRef.current) {
      console.warn("Plot ref not ready yet");
      return;
    }

    // data validity checks
    if (
      !plotRef.current ||
      !a2f ||
      !frequency ||
      !degaussq ||
      !lambda ||
      degaussq.length === 0 ||
      !a2f[0] ||
      selectedDegaussIndex < -1 || // optionally check invalid index
      (selectedDegaussIndex >= 0 && selectedDegaussIndex >= degaussq.length) ||
      (selectedDegaussIndex >= 0 && selectedDegaussIndex >= a2f[0].length)
    ) {
      Plotly.purge(plotRef.current);
      console.warn("Invalid data or index");
      return;
    }

    // Map -1  to be equal  to end val
    const resolvedIndex =
      selectedDegaussIndex < 0 ? degaussq.length - 1 : selectedDegaussIndex;

    const traces = [];
    traces.push({
      x: a2f.map((row) => row[resolvedIndex]),
      y: frequency,
      type: "scatter",
      mode: "lines",
      label: `${A2F_TRACE_CONFIG.label}`,
      name: `${A2F_TRACE_CONFIG.label}`,
      hovertemplate: `<b>${A2F_TRACE_CONFIG.label}</b>: %{x:.3f} ${A2F_TRACE_CONFIG.units}<br><extra></extra>`,
      line: {
        color: A2F_TRACE_CONFIG.color,
        dash: A2F_TRACE_CONFIG.dash,
        width: A2F_TRACE_CONFIG.lineWidth,
      },
    });

    // Compute cumulative lambda(ω)
    const deltaFreq = frequency[1] - frequency[0];
    const cumulativeLambda = [];
    let integral = 0;

    for (let j = 0; j < frequency.length; j++) {
      const omega = frequency[j];
      const a2fVal = a2f[j][resolvedIndex];
      integral += ((2 * a2fVal) / omega) * deltaFreq;
      cumulativeLambda.push(integral);
    }

    traces.push({
      y: frequency,
      x: cumulativeLambda,
      type: "scatter",
      mode: "lines",
      name: `${A2F_CUMULATIVE_CONFIG.label}`,
      hovertemplate: `<b>${A2F_CUMULATIVE_CONFIG.label}</b>: %{x:.3f} ${A2F_TRACE_CONFIG.units}<br><extra></extra>`,

      line: {
        color: A2F_CUMULATIVE_CONFIG.color,
        dash: A2F_CUMULATIVE_CONFIG.dash,
        width: A2F_CUMULATIVE_CONFIG.lineWidth,
      },
    });

    // add the maxYval.
    let Layout = A2F_LAYOUT_CONFIG;
    if (maxYval) {
      Layout = {
        ...A2F_LAYOUT_CONFIG,
        yaxis: {
          ...A2F_LAYOUT_CONFIG.yaxis,
          range: [0, maxYval],
        },
      };
    }

    Plotly.newPlot(plotRef.current, traces, Layout, {
      responsive: true,
    });

    return () => {
      if (plotRef.current) Plotly.purge(plotRef.current);
    };
  }, [a2f, frequency, degaussq, lambda, selectedDegaussIndex]);

  return <div ref={plotRef} style={{ width: "100%", height: "450px" }} />;
}

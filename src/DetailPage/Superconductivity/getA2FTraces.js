/**
 * Returns Plotly traces for α²F and cumulative λ(ω)
 */

const A2F_TRACE_CONFIG = {
  color: "#d62728",
  dash: "solid",
  label: "α<sup>2</sup>F(ω)",
  lineWidth: 1.75,
  xaxis: "x2",
  yaxis: "y2",
};

const A2F_CUMULATIVE_CONFIG = {
  color: "#111",
  dash: "solid",
  label: "λ(ω)",
  lineWidth: 1.75,
  units: "a2f",
  xaxis: "x3",
  yaxis: "y2",
};

export function getA2FTraces({
  a2f,
  frequency,
  degaussq,
  selectedDegaussIndex = -1,
}) {
  if (!a2f || !frequency || !degaussq || degaussq.length === 0) return [];

  const resolvedIndex =
    selectedDegaussIndex < 0 ? degaussq.length - 1 : selectedDegaussIndex;

  // α²F trace
  const a2fTrace = {
    x: a2f.map((row) => row[resolvedIndex]),
    y: frequency,
    type: "scatter",
    mode: "lines",
    name: A2F_TRACE_CONFIG.label,
    hovertemplate: `<b>${A2F_TRACE_CONFIG.label}</b>: %{x:.3f} <br><extra></extra>`,
    line: {
      color: A2F_TRACE_CONFIG.color,
      dash: A2F_TRACE_CONFIG.dash,
      width: A2F_TRACE_CONFIG.lineWidth,
    },
    xaxis: A2F_TRACE_CONFIG.xaxis,
    yaxis: A2F_TRACE_CONFIG.yaxis,
  };

  // cumulative λ(ω) trace
  const deltaFreq = frequency[1] - frequency[0];
  let integral = 0;
  const cumulativeLambda = frequency.map((omega, j) => {
    const a2fVal = a2f[j][resolvedIndex];
    integral += ((2 * a2fVal) / omega) * deltaFreq;
    return integral;
  });

  const cumulativeTrace = {
    x: cumulativeLambda,
    y: frequency,
    type: "scatter",
    mode: "lines",
    name: A2F_CUMULATIVE_CONFIG.label,
    label: `${A2F_CUMULATIVE_CONFIG.label}`,
    name: A2F_CUMULATIVE_CONFIG.label,
    hovertemplate: `<b>${A2F_CUMULATIVE_CONFIG.label}</b>: %{x:.3f} ${A2F_CUMULATIVE_CONFIG.units}<br><extra></extra>`,
    line: {
      color: A2F_CUMULATIVE_CONFIG.color,
      dash: A2F_CUMULATIVE_CONFIG.dash,
      width: A2F_CUMULATIVE_CONFIG.lineWidth,
    },
    xaxis: A2F_CUMULATIVE_CONFIG.xaxis,
    yaxis: A2F_CUMULATIVE_CONFIG.yaxis,
  };

  console.log("c", [a2fTrace, cumulativeTrace]);
  return [a2fTrace, cumulativeTrace];
}

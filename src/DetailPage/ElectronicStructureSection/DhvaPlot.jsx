import { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-basic-dist-min";

function getMfPathEdgeLabels(path) {
  const parts = path.split("_");
  if (parts.length === 2) return parts;
  return [path, path]; // fallback if format unexpected
}

function buildDiscreteX(phi = [], theta = []) {
  let step = -1;
  let lastKey = null;

  return phi.map((p, i) => {
    const t = theta?.[i] ?? null;
    const key = `${p}|${t}`;

    if (key !== lastKey) {
      step += 1;
      lastKey = key;
    }

    return step;
  });
}

function getMaxY(data) {
  if (!data?.skeaf_workchains) return 0;

  let maxY = -Infinity;

  for (const wc of data.skeaf_workchains) {
    for (const band of wc.bands ?? []) {
      const freq = band.xyData?.freq;
      if (!Array.isArray(freq)) continue;

      for (const v of freq) {
        if (typeof v === "number" && v > maxY) {
          maxY = v;
        }
      }
    }
  }

  return maxY === -Infinity ? 0 : maxY;
}

const COMMON_LAYOUT_CONFIG = {
  // Common Y-axis settings
  yaxis: {
    zeroline: false,
    showgrid: false,
    showline: false,
    ticks: "inside",
    tickfont: { size: 14, color: "#333" },
    title: {
      font: { size: 16, color: "#333" },
      standoff: 10,
      text: "frequency kT",
    },
    // Do NOT set 'tickvals' or 'ticktext' here
  },

  // Common X-axis settings
  xaxis: {
    zeroline: false,
    showgrid: true,
    ticks: "inside",
    tickfont: { size: 14, color: "#333" },
    title: {
      font: { size: 16, color: "#333" },
      standoff: 10,
      text: "Rotation",
    },
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

  margin: { l: 65, r: 10, t: 10, b: 50 },

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

export default function DhvaPlot({ data }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(false);
  const [selectedMfPath, setSelectedMfPath] = useState(null);

  const mfPaths = data?.skeaf_workchains?.map((wc) => wc.mf_path) ?? [];

  // guard against missing DOM
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      if (containerRef.current) {
        Plotly.purge(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;
    if (!data || !containerRef.current || !mfPaths.length) return;
    if (!selectedMfPath) setSelectedMfPath(mfPaths[0]);
  }, [data, mfPaths, selectedMfPath]);

  useEffect(() => {
    if (!mountedRef.current) return;
    if (!selectedMfPath) return;
    if (!containerRef.current) return;

    const wc = data.skeaf_workchains.find(
      (wc) => wc.mf_path === selectedMfPath,
    );
    if (!wc) return;

    const maxY = getMaxY(data);

    const traces = wc.bands
      .filter(
        (band) => band.xyData?.freq && (band.xyData?.phi || band.xyData?.theta),
      )
      .map((band) => {
        const { phi = [], theta = [] } = band.xyData;

        const x = buildDiscreteX(phi, theta);

        return {
          x,
          y: band.xyData.freq,
          mode: "markers",
          name: `Band ${band.band_number}`,
          hoverinfo: "skip",
        };
      });

    if (!traces.length) return;

    const [firstLabel, lastLabel] = getMfPathEdgeLabels(selectedMfPath);

    const lastIndex = Math.max(...traces.map((t) => t.x[t.x.length - 1]));

    const layout = {
      ...COMMON_LAYOUT_CONFIG,
      xaxis: {
        ...COMMON_LAYOUT_CONFIG.xaxis,
        tickvals: [0, lastIndex],
        ticktext: [firstLabel, lastLabel],
        range: [-2, lastIndex + 2],
      },
      yaxis: {
        ...COMMON_LAYOUT_CONFIG.yaxis,
        range: [-2, maxY * 1.25],
      },
    };

    Plotly.react(containerRef.current, traces, layout, {
      responsive: true,
      displayModeBar: false,
    });
  }, [selectedMfPath, data]);

  if (!mfPaths.length) return null;

  return (
    <>
      <div className="subsection-title">De Haas-Van Alphen plots</div>
      <div style={{ position: "relative", width: "100%", height: "500px" }}>
        {/* Absolute positioned dropdown */}
        <div
          style={{
            position: "absolute",
            top: "15px",
            left: "70px",
            backgroundColor: "rgba(182, 22, 22, 0)",
            padding: "4px 8px",
            zIndex: 10,
          }}
        >
          <select
            id="mfPathSelect"
            value={selectedMfPath}
            onChange={(e) => setSelectedMfPath(e.target.value)}
          >
            {mfPaths.map((path) => {
              const [firstLabel, lastLabel] = getMfPathEdgeLabels(path);
              return (
                <option key={path} value={path}>
                  {firstLabel} → {lastLabel}
                </option>
              );
            })}
          </select>
        </div>

        {/* Plot container */}
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </>
  );
}

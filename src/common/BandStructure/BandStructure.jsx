import { useEffect, useRef } from "react";
import { BandsVisualiser } from "bands-visualiser";

import { SUPERCON_BANDS_LAYOUT_CONFIG, traceConfigs } from "./configs";

// Helper
function shiftBands(bandsData, shift) {
  bandsData.paths.forEach((path) => {
    path.values.forEach((subpath) => {
      subpath.forEach((val, idx, arr) => {
        arr[idx] += shift;
      });
    });
  });
}

// supercon data set is not spin polarised
// only use the first color in colors
// and dont try to spin split.
export function prepareSuperConBand(
  bandObject,
  shiftVal = 0,
  config = "unknownEntry",
) {
  // shift bandobject to fermiLevel
  shiftBands(bandObject, shiftVal);

  let traceFormat = traceConfigs[config];

  const bandsDataArrayObj = {
    bandsData: bandObject,
    traceFormat: {
      label: `${traceFormat.label}`,
      name: traceFormat.label,

      hovertemplate: `<b>${traceFormat.label}</b>: %{y:.3f} ${traceFormat.units}<br><extra></extra>`,
      mode: traceFormat.mode,
      // marker: traceFormat.marker,
      line: {
        color: traceFormat.colors[0],
        dash: traceFormat.dash,
        width: traceFormat.width,
        opacity: traceFormat.opacity,
      },
    },
  };

  return bandsDataArrayObj;
}

// Standalone visualiser component
// expects the bandsDataArray to contain already traceFormatted entries.
export function BandStructure({
  bandsDataArray,
  loading,
  maxYval = null, // incase you want to force Yvals.
  minYval = null,
}) {
  const containerRef = useRef(null);
  const visualiserRef = useRef(null);

  const plotSettings = SUPERCON_BANDS_LAYOUT_CONFIG;

  // deep merge Yvals
  const settings = {
    ...plotSettings,
    yaxis: {
      ...(plotSettings.yaxis || {}),
      range: [minYval, maxYval],
    },
  };

  useEffect(() => {
    if (!containerRef.current || !bandsDataArray) return;

    if (visualiserRef.current?.destroy) {
      visualiserRef.current.destroy();
    }

    visualiserRef.current = BandsVisualiser(containerRef.current, {
      bandsDataArray,
      settings,
    });
  }, [bandsDataArray]);

  if (loading)
    return (
      <div
        className="placeholder-wave d-flex align-items-center justify-content-center rounded bg-secondary"
        style={{ height: "450px", width: "100%" }}
      >
        <span>Loading...</span>
      </div>
    );
  if (!bandsDataArray)
    return (
      <div
        className="placeholder-wave d-flex align-items-center justify-content-center rounded bg-secondary"
        style={{ height: "500px", width: "100%" }}
      >
        <span> ... Malformed Bands/DOS Data? ... </span>
      </div>
    );

  return (
    <div>
      <div ref={containerRef} style={{ width: "100%", height: "450px" }} />
    </div>
  );
}

export default BandStructure;

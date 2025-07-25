import { useEffect, useRef } from "react";
import { BandsVisualiser, splitBandsData } from "bands-visualiser";

import { CONFIG_MAP } from "./configs";

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

// stretches bandData arrays so that they share a global xMin and global xMax.

function normalizeBandsData(bandsObjects) {
  // Step 1: find global x-range
  let globalMin = Infinity;
  let globalMax = -Infinity;

  bandsObjects.forEach((bandObj) => {
    bandObj.paths.forEach((path) => {
      if (!path.x || path.x.length === 0) return;
      globalMin = Math.min(globalMin, path.x[0]);
      globalMax = Math.max(globalMax, path.x[path.x.length - 1]);
    });
  });

  // helper: scale array to new range
  function rescaleArray(arr, newMin, newMax) {
    const oldMin = arr[0];
    const oldMax = arr[arr.length - 1];
    if (oldMax === oldMin) return arr.map(() => newMin); // avoid div by 0
    const scale = (newMax - newMin) / (oldMax - oldMin);
    return arr.map((x) => newMin + (x - oldMin) * scale);
  }

  // Step 2: produce new objects with rescaled x
  const newBandsObjects = bandsObjects.map((bandObj) => {
    const newPaths = bandObj.paths.map((path) => {
      const scaledX = rescaleArray(path.x, globalMin, globalMax);
      return {
        ...path,
        x: scaledX,
      };
    });
    return {
      ...bandObj,
      paths: newPaths,
    };
  });

  return newBandsObjects;
}

// helper function to merge supercon wannier + supercon dft into one singular bands array
// this is fairly flexible and maybe usable for other general purpose data.
export function prepareSuperConBands(
  bandsObjects,
  seperate_spins = true,
  shiftValue = 0,
  config = "supercon-bands-wannier",
) {
  // shift each bandobject to the singular fermilevel.
  for (const bandsObject of bandsObjects) {
    shiftBands(bandsObject, shiftValue);
  }

  let trace_config = CONFIG_MAP[config].traces;

  // WARNING
  // super con data has non-equivalent x-step sizes.
  // I have written a normalizedBandsData method to handle this.
  const normalizedbandsObjects = normalizeBandsData(bandsObjects);

  // We dont expect spin resolved calcs but we handle them just in case.
  let spinSeparatedArray = [];

  let datasetIndex = 0;
  normalizedbandsObjects.forEach((bandsObject) => {
    // step through the array
    const traceFormat = trace_config[datasetIndex % trace_config.length];

    const [primaryColor, secondaryColor] = traceFormat.colors;
    const dash = traceFormat.dash;

    if (seperate_spins && bandsObject.paths[0].two_band_types) {
      const [downBands, upBands] = splitBandsData(bandsObject, 2);

      spinSeparatedArray.push(
        {
          bandsData: downBands,
          traceFormat: {
            label: `${traceFormat.label} ↓`,
            name: traceFormat.label,

            hovertemplate:
              "<b>${traceFormat.label} Down Spin</b>: %{y:.3f} eV<br><extra></extra>",
            line: { color: primaryColor, dash: traceFormat.dash, width: 1.6 },
          },
        },
        {
          bandsData: upBands,
          traceFormat: {
            label: `${traceFormat.label} ↑`,
            name: traceFormat.label,
            hovertemplate: `<b>${traceFormat.label} Up Spin</b>: %{y:.3f} eV<br><extra></extra>`,
            line: { color: secondaryColor, dash: traceFormat.dash, width: 1.6 },
          },
        },
      );
    } else {
      spinSeparatedArray.push({
        bandsData: bandsObject,
        traceFormat: {
          label: traceFormat.label,
          name: traceFormat.label,
          hovertemplate: `<b>${traceFormat.label}</b>: %{y:.3f} eV<br><extra></extra>`,
          line: { color: primaryColor, dash: traceFormat.dash, width: 1.6 },
        },
      });
    }

    datasetIndex += 1;
  });

  return spinSeparatedArray;
}

// Standalone visualiser component,
// wraps the js BandsVisualiser in a ref
export function BandStructure({
  bandsDataArray,
  loading,
  config = "supercon-bands-wannier",
}) {
  const containerRef = useRef(null);
  const visualiserRef = useRef(null);

  let settings = CONFIG_MAP[config].layout;

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
        style={{ height: "450px", width: "100%" }}
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

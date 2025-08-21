import { useEffect, useRef } from "react";
import { BandsVisualiser } from "bands-visualiser";

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

// Standalone visualiser component
// expects the bandsDataArray to contain already traceFormatted entries.
// can override the default layout by passing a layoutOverride.
export function BandStructure({
  bandsDataArray,
  loading,
  maxYval = null,
  minYval = null,
  layoutOverrides = null,
}) {
  const containerRef = useRef(null);

  const settings = layoutOverrides ?? {};
  settings.yaxis.range = [minYval, maxYval];

  useEffect(() => {
    if (!containerRef.current || !bandsDataArray) return;

    BandsVisualiser(containerRef.current, {
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

export function BandsA2F({
  bandsDataArray,
  dosDataArray = [],
  loading,
  minYval = null,
  maxYval = null,
  layoutOverrides = null,
  customTraces = [],
}) {
  const containerRef = useRef(null);

  const settings = layoutOverrides;

  if (minYval != null && maxYval != null) {
    settings.yaxis.range = [minYval, maxYval];
  }

  useEffect(() => {
    if (!containerRef.current || !bandsDataArray) return;

    BandsVisualiser(containerRef.current, {
      bandsDataArray,
      dosDataArray,
      customTraces,
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

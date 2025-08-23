import { useEffect, useRef } from "react";
import { BandsVisualiser } from "bands-visualiser";

/**
 * Standalone visualiser component for band structures with optional DOS overlay.
 *
 * @param {Object[]} bandsDataArray - Array of already trace-formatted band data.
 * @param {Object[]|null} [dosDataArray=null] - Optional DOS data array to plot alongside bands.
 * @param {Object[]|null} [customTraces=[]] - Optional extra Plotly traces to include.
 * @param {number|null} [minYval=null] - Optional minimum Y-axis value.
 * @param {number|null} [maxYval=null] - Optional maximum Y-axis value.
 * @param {Object|null} [layoutOverrides=null] - Optional Plotly layout overrides.
 */
export function BandStructure({
  bandsDataArray,
  dosDataArray = undefined,
  customTraces = [],
  minYval = null,
  maxYval = null,
  layoutOverrides = null,
}) {
  const containerRef = useRef(null);

  // clone settings to avoid mutating props
  const settings = { ...(layoutOverrides ?? {}) };

  if (minYval != null && maxYval != null) {
    settings.yaxis = {
      ...(settings.yaxis ?? {}),
      range: [minYval, maxYval],
    };
  }

  useEffect(() => {
    if (!containerRef.current || !bandsDataArray) return;

    BandsVisualiser(containerRef.current, {
      bandsDataArray,
      dosDataArray,
      customTraces,
      settings,
    });
  }, [bandsDataArray, dosDataArray, customTraces]);

  if (!bandsDataArray)
    return (
      <div
        className="placeholder-wave d-flex align-items-center justify-content-center rounded bg-secondary"
        style={{ height: "450px", width: "100%" }}
      >
        <span> Failed to render data for the visualiser </span>
      </div>
    );

  return <div ref={containerRef} style={{ width: "100%", height: "450px" }} />;
}

export default BandStructure;

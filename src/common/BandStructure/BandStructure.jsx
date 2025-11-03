import { useEffect, useRef, useMemo } from "react";
import { BandsVisualiser } from "bands-visualiser";
import { McloudSpinner } from "mc-react-library";

export default function BandStructure({
  bandsDataArray,
  loading = false,
  loadingIconScale = 15,
  dosDataArray = undefined,
  customTraces = [],
  minYval = null,
  maxYval = null,
  layoutOverrides = null,
}) {
  const containerRef = useRef(null);

  const settings = useMemo(() => {
    const s = { ...(layoutOverrides ?? {}) };
    if (minYval != null && maxYval != null) {
      s.yaxis = { ...(s.yaxis ?? {}), range: [minYval, maxYval] };
    }
    return s;
  }, [layoutOverrides, minYval, maxYval]);

  useEffect(() => {
    if (loading || !containerRef.current || !bandsDataArray) return;

    BandsVisualiser(containerRef.current, {
      bandsDataArray,
      dosDataArray,
      customTraces,
      settings,
    });
  }, [bandsDataArray, dosDataArray, customTraces, settings, loading]);

  return (
    <div
      ref={containerRef}
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

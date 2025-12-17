import { useEffect, useRef } from "react";
import { FermiVisualiser } from "fermisurface-visualiser";
import { McloudSpinner } from "mc-react-library";

export default function FermiVisualiserReact({
  data,
  loading = false,
  spinnerScale = 15,
  size = 500,
}) {
  const containerRef = useRef(null);
  const visRef = useRef(null);

  useEffect(() => {
    if (loading || !containerRef.current || !data) return;

    // initialize visualiser
    visRef.current = new FermiVisualiser(containerRef.current, data);
    // optional: set initial E value
    visRef.current.update(data.fermiEnergy);

    // cleanup on unmount
    return () => {
      if (visRef.current?.dispose) visRef.current.dispose();
      if (containerRef.current) containerRef.current.innerHTML = "";
      visRef.current = null;
    };
  }, [data, loading]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: `${size}px`,
        aspectRatio: "1 / 1",
        border: "1px solid #888",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {loading && (
        <div
          style={{
            width: `${spinnerScale}%`,
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

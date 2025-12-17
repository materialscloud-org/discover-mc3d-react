import { useEffect, useRef, useState, useMemo } from "react";
import { FermiVisualiser } from "fermisurface-visualiser";
import { McloudSpinner } from "mc-react-library";

import { Form, Button } from "react-bootstrap";

export default function FermiVisualiserReact({
  data,
  loading = false,
  spinnerScale = 15,
  size = 500,
}) {
  const containerRef = useRef(null);
  const visRef = useRef(null);

  const baseEf = data?.fermiEnergy ?? 0;
  const [fermiLevel, setFermiLevel] = useState(baseEf);

  const sliderConfig = useMemo(
    () => ({
      min: baseEf - 2,
      max: baseEf + 2,
      step: 0.05,
    }),
    [baseEf],
  );

  useEffect(() => {
    if (loading || !containerRef.current || !data) return;

    visRef.current = new FermiVisualiser(containerRef.current, data);
    visRef.current.update(baseEf);

    return () => {
      if (visRef.current?.dispose) visRef.current.dispose();
      if (containerRef.current) containerRef.current.innerHTML = "";
      visRef.current = null;
    };
  }, [data, loading, baseEf]);

  useEffect(() => {
    if (!visRef.current) return;
    visRef.current.update(fermiLevel);
  }, [fermiLevel]);

  return (
    <>
      <div className="subsection-title">Fermisurface Plot</div>

      <div
        style={{
          position: "relative",
          width: `${size}px`,
          aspectRatio: "1 / 1",
          border: "1px solid #888",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Plot */}
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

        {/* Slider overlay */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            padding: "2px",
            zIndex: 10,
            width: "140px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
              fontSize: "0.85em",
            }}
          >
            <span>
              shift: <b>{(fermiLevel - baseEf).toFixed(2)}</b>
            </span>
            <Button size="sm" onClick={() => setFermiLevel(baseEf)}>
              reset
            </Button>
          </div>

          <Form.Range
            min={sliderConfig.min}
            max={sliderConfig.max}
            step={sliderConfig.step}
            value={fermiLevel}
            onChange={(e) => setFermiLevel(parseFloat(e.target.value))}
          />
        </div>

        {loading && (
          <div
            style={{
              width: `${spinnerScale}%`,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 20,
            }}
          >
            <McloudSpinner />
          </div>
        )}
      </div>
    </>
  );
}

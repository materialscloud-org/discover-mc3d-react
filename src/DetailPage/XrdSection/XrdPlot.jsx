import { useState, useEffect, useRef } from "react";
import Plotly from "plotly.js-basic-dist-min";
import Form from "react-bootstrap/Form";
import { Row, Col } from "react-bootstrap";
import { wavelengthName, getFittedCurve, getHistogram } from "./utils.js";

const XrdPlot = ({ xrdData }) => {
  const plotRef = useRef(null);
  const wavelengthsList = Object.keys(xrdData);

  const [wavelength, setWavelength] = useState(wavelengthsList[0]);
  const [fitType, setFitType] = useState("Gaussian");
  const [fwhm, setFwhm] = useState(1.0);
  const [showCurve, setShowCurve] = useState(true);
  const [showHistogram, setShowHistogram] = useState(true);

  const fitTypes = ["Gaussian", "Lorentzian"];

  // Build traces on render
  const plotData = [];
  if (showHistogram) plotData.push(getHistogram(xrdData[wavelength]));
  if (showCurve)
    plotData.push(getFittedCurve(xrdData[wavelength], fwhm, fitType));

  const xRange = xrdData[wavelength].angular_range.slice();
  const yRange = [0, null];

  // useEffect to render Plotly manually
  useEffect(() => {
    if (!plotRef.current) return;

    const layout = {
      showlegend: false,
      xaxis: {
        range: xRange,
        title: "2\u03F4 [°]",
        linecolor: "black",
        linewidth: 1,
        tickwidth: 1,
        tickcolor: "black",
        gridcolor: "lightgray",
        mirror: true,
      },
      yaxis: {
        range: yRange,
        title: "Intensity [a.u.]",
        linecolor: "black",
        linewidth: 1,
        tickwidth: 1,
        tickcolor: "black",
        gridcolor: "lightgray",
        mirror: true,
      },
      margin: { l: 50, r: 20, b: 40, t: 20 },
    };

    const config = { responsive: true };

    Plotly.newPlot(plotRef.current, plotData, layout, config);

    // cleanup on unmount
    return () => {
      Plotly.purge(plotRef.current);
    };
  }, [xrdData, wavelength, fitType, fwhm, showCurve, showHistogram]);

  return (
    <div>
      <Row>
        <Col style={{ minWidth: "300px" }}>
          <Form>
            <Form.Label>Select the X-ray source</Form.Label>
            <Form.Select
              value={wavelength}
              onChange={(e) => setWavelength(e.target.value)}
            >
              {wavelengthsList.map((wl) => (
                <option key={wl} value={wl}>
                  {wavelengthName(wl)}
                </option>
              ))}
            </Form.Select>
          </Form>

          <Form>
            <Form.Label>Select peak broadening profile</Form.Label>
            <Form.Select
              value={fitType}
              onChange={(e) => setFitType(e.target.value)}
            >
              {fitTypes.map((ft) => (
                <option key={ft} value={ft}>
                  {ft}
                </option>
              ))}
            </Form.Select>
          </Form>

          <Form>
            <Form.Label>
              Select peak broadening FWHM (full width at half maximum)
              <br /> value: {fwhm.toFixed(2)}
            </Form.Label>
            <Form.Range
              min={0.1}
              max={2.0}
              step={0.05}
              value={fwhm}
              onInput={(e) => setFwhm(parseFloat(e.target.value))}
            />
          </Form>

          <Form>
            <Form.Check
              checked={showCurve}
              onChange={(e) => setShowCurve(e.target.checked)}
              label="Show broadened curve"
            />
            <Form.Check
              checked={showHistogram}
              onChange={(e) => setShowHistogram(e.target.checked)}
              label="Show histogram"
            />
          </Form>
        </Col>
        <Col>
          <div
            ref={plotRef}
            style={{
              width: "100%",
              height: "100%",
              minHeight: "400px",
              minWidth: "300px",
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default XrdPlot;

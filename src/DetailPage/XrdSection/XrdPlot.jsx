import { useState } from "react";
import Plot from "react-plotly.js";
import Form from "react-bootstrap/Form";

import { Row, Col } from "react-bootstrap";

import { wavelengthName, getFittedCurve, getHistogram } from "./utils.js";

const XrdPlot = (props) => {
  let wavelengthsList = Object.keys(props.xrdData);

  const [wavelength, setWavelength] = useState(wavelengthsList[0]);
  const [fitType, setFitType] = useState("Gaussian");
  const [fwhm, setFwhm] = useState(1.0);
  const [showCurve, setShowCurve] = useState(true);
  const [showHistogram, setShowHistogram] = useState(true);

  let fitTypes = ["Gaussian", "Lorentzian"];

  let xRange = props.xrdData[wavelength].angular_range.slice();
  let yRange = [0, null];

  let plotData = [];
  if (showHistogram) {
    plotData.push(getHistogram(props.xrdData[wavelength]));
  }
  if (showCurve) {
    plotData.push(getFittedCurve(props.xrdData[wavelength], fwhm, fitType));
  }

  return (
    <div>
      <Row>
        <Col style={{ minWidth: "300px" }}>
          <Form>
            <Form.Label>Select the X-ray source</Form.Label>
            <Form.Select onChange={(e) => setWavelength(e.target.value)}>
              {wavelengthsList.map((wl) => (
                <option key={wl} value={wl}>
                  {wavelengthName(wl)}
                </option>
              ))}
            </Form.Select>
          </Form>

          <Form>
            <Form.Label>Select peak broadening profile</Form.Label>
            <Form.Select onChange={(e) => setFitType(e.target.value)}>
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
              onInput={(e) =>
                fwhm !== e.target.value && setFwhm(parseFloat(e.target.value))
              }
            />
          </Form>

          <Form>
            <Form.Check
              // inline
              checked={showCurve}
              onChange={(e) => setShowCurve(e.target.checked)}
              label="Show broadened curve"
              name="group1"
              type="checkbox"
              id={`inline-checkbox-1`}
            />
            <Form.Check
              // inline
              checked={showHistogram}
              onChange={(e) => setShowHistogram(e.target.checked)}
              label="Show histogram"
              name="group1"
              type="checkbox"
              id={`inline-checkbox-2`}
            />
          </Form>
        </Col>
        <Col>
          <Plot
            data={plotData}
            config={{ responsive: true }}
            style={{
              width: "100%",
              height: "100%",
              minHeight: "400px",
              minWidth: "300px",
            }}
            layout={{
              showlegend: false,
              xaxis: {
                range: xRange,
                title: "2\u03F4" + " [°]",
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
              margin: {
                l: 50,
                r: 20,
                b: 40,
                t: 20,
              },
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default XrdPlot;

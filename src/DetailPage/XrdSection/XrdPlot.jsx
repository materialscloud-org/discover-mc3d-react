import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { conv_wl_name, doFitting } from "./utils.js";

const XrdPlot = (props) => {
  let wavelengthsList = Object.keys(props.xrdData);

  const [wavelength, setWavelength] = useState(wavelengthsList[0]);
  const [fitType, setFitType] = useState("Gaussian");
  const [fwhm, setFwhm] = useState(0.1);
  const [showCurve, setShowCurve] = useState(true);
  const [showHistogram, setShowHistogram] = useState(true);

  const constructPlotData = () => {
    if (props.xrdData == null) {
      return null;
    }

    let peaks_positions = props.xrdData[wavelength].peaks_positions;
    let intensities = props.xrdData[wavelength].intensities;
    let angular_range = props.xrdData[wavelength].angular_range;
    let hkls = props.xrdData[wavelength].hkls;

    let fit = doFitting(
      peaks_positions,
      intensities,
      angular_range,
      fwhm,
      fitType,
    );
    let result = [];

    let curve_dict = {
      type: "scatter",
      mode: "lines+points",
      x: fit.x,
      y: fit.curve,
      marker: { color: "red", size: 0.5 },
      line: { width: 1 },
      hoverinfo: "none",
    };

    let hist_dict = {
      type: "bar",
      x: peaks_positions,
      y: intensities,
      hovertemplate: "hkl: <b>%{text}</b><extra></extra>",
      text: hkls,
      width: 0.5,
      marker: {
        color: "black",
        opacity: 0.7,
      },
    };

    if (showCurve) {
      result.push(curve_dict);
    }
    if (showHistogram) {
      result.push(hist_dict);
    }
    return result;
  };

  let XrdParamsSelector = <div></div>;

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {conv_wl_name(wavelength)}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {wavelengthsList.map((wl) => (
            <Dropdown.Item
              key={wl}
              eventKey={wl}
              onClick={() => wavelength !== wl && setWavelength(wl)}
            >
              {conv_wl_name(wl)}{" "}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown className="white-background">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {fitType}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => fitType !== "Gaussian" && setFitType("Gaussian")}
          >
            Gaussian
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => fitType !== "Lorentzian" && setFitType("Lorentzian")}
          >
            Lorentzian
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Form>
        <Form.Label>FWHM</Form.Label>
        <Form.Group controlId="formBasicRange">
          <Form.Label>Value: {fwhm}</Form.Label>
          <Form.Range
            min={0.0}
            max={2.0}
            step={0.05}
            value={fwhm}
            onInput={(e) => fwhm !== e.target.value && setFwhm(e.target.value)}
          />
        </Form.Group>
      </Form>

      <Form>
        <div key={`inline-checkbox`} className="mb-3">
          <Form.Check
            inline
            checked={showCurve}
            onChange={(e) => setShowCurve(e.target.checked)}
            label="Show broadened curve"
            name="group1"
            type="checkbox"
            id={`inline-checkbox-1`}
          />
          <Form.Check
            inline
            checked={showHistogram}
            onChange={(e) => setShowHistogram(e.target.checked)}
            label="Show histogram"
            name="group1"
            type="checkbox"
            id={`inline-checkbox-2`}
          />
        </div>
      </Form>
      <Plot
        data={constructPlotData()}
        layout={{
          width: 660,
          height: 480,
          showlegend: false,
          xaxis: { title: "2\u03F4" + ", °" },
          yaxis: { title: "Intensity, a.u." },
        }}
      />
    </div>
  );
};

export default XrdPlot;

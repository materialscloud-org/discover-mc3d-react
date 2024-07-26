import React, { useState, useEffect } from "react";

import XrdPlot from "./XrdPlot";

import { loadXrd } from "../../common/restApiUtils";

import { McloudSpinner } from "mc-react-library";

import { Container, Row, Col } from "react-bootstrap";

const XrdSection = (props) => {
  const [xrdData, setXrdData] = useState(null);
  const [notAvail, setNotAvail] = useState(false);

  useEffect(() => {
    loadXrd(props.params.method, props.params.id).then((loadedXrd) => {
      if (loadedXrd) {
        console.log("Loaded XRD data", loadedXrd);
        setXrdData(loadedXrd);
      } else {
        setNotAvail(true);
      }
    });
  }, []);

  let xrd = "";

  if (notAvail) {
    xrd = "Not available for this material.";
  } else if (xrdData == null) {
    xrd = (
      <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
        <McloudSpinner />
      </div>
    );
  } else {
    xrd = <XrdPlot xrdData={xrdData} />;
  }

  return (
    <div>
      <div className="section-heading">X-ray diffraction pattern</div>
      <Container fluid className="section-container">
        <Row>
          <div className="xrd-section">{xrd}</div>
        </Row>
      </Container>
    </div>
  );
};

export default XrdSection;

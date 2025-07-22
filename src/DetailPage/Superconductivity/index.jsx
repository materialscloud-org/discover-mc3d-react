import React from "react";

import { Container, Row, Col } from "react-bootstrap";

import "./index.css";

import BandStructure from "../../common/BandStructure/BandStructure";

import { MCInfoBox } from "../../common/MCInfoBox";

import { DoiBadge } from "mc-react-library";

function SuperConductivity({ params, loadedData }) {
  return (
    <div>
      <div className="section-heading">Contribution: Superconductivity</div>
      <div class="alert alert-warning" role="alert">
        Superconduction properities have been been provided by Citation blah
        blah blah and use a re-relaxed structure from a differing
        psuedopotential. This rerelaxed structure can be found in the provenence
        browser [PROV ICON] For details on the exact methodology see [HERE]. If
        using any of the data in this section be sure to cite the correct
        authors.
        <DoiBadge doi_id="TEMP URL" />
      </div>
      <Container fluid className="section-container">
        <Row>
          <div className="subsection-title">Wannier vs DFT BandsData...</div>
          <Col className="flex-column">
            <BandStructure />
          </Col>
          <Col>
            <MCInfoBox style={{ height: "150px" }}>
              <div>
                <b>Superconductivity info box</b>
                <ul className="no-bullets">
                  <li>Isotropic Critical Temperature [1].</li>
                  <li>Anisotropic Critcal Temperature [2].</li>
                  <li>Gamma [3]</li>
                </ul>
              </div>
            </MCInfoBox>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="subsection-title">2x1 Phonon Bands + DOS</div>
            <BandStructure />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SuperConductivity;

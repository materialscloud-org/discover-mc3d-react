import React, { useState, useEffect } from "react";

import "./index.css";

import { ExploreButton } from "mc-react-library";

import { EXPLORE_URL } from "../../common/config";

import { Container, Row, Col } from "react-bootstrap";

function ProvenanceSection(props) {
  let details = props.loadedData.details;

  return (
    <div>
      <div className="section-heading">Provenance links</div>
      <Container fluid className="section-container">
        <Row>
          <div className="provenance-section">
            <div className="provenance-section-inner">
              <div>Relevant nodes in the provenance browser:</div>
              <ul>
                {details.provenance_links.map((e) => {
                  return (
                    <li key={e.uuid}>
                      {e.label}{" "}
                      <ExploreButton
                        explore_url={EXPLORE_URL}
                        uuid={details.general.uuid_structure}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default ProvenanceSection;

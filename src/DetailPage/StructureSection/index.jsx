import React from "react";

import { ExploreButton, StructDownloadButton } from "mc-react-library";

import { EXPLORE_URL } from "../../common/config";

import { Container, Row, Col } from "react-bootstrap";

import { MCTable } from "../../common/MCTable";
import { MCInfoBox } from "../../common/MCInfoBox";

import "./index.css";

const StructureSection = (props) => {
  let aiidaRestEndpoint = props.loadedData.aiidaRestEndpoint;
  let details = props.loadedData.details;
  let structureInfo = props.loadedData.structureInfo;

  return (
    <div>
      <div className="section-heading">Structural details</div>
      <Container fluid className="section-container">
        <Row>
          <Col>
            <MCInfoBox title="General" style={{ marginBottom: "25px" }}>
              <ul className="no-bullets">
                <li>
                  Explore provenance{" "}
                  <ExploreButton
                    explore_url={EXPLORE_URL}
                    uuid={details.general.uuid_structure}
                  />
                </li>
                <li>
                  Download structure
                  <StructDownloadButton
                    aiida_rest_url={aiidaRestEndpoint}
                    uuid={details.general.uuid_structure}
                  />
                </li>
              </ul>
            </MCInfoBox>
            <MCTable
              title="Cell"
              headerRow={["", "x [Å]", "y [Å]", "z [Å]"]}
              contents={structureInfo.aiidaAttributes.cell.map((v, i) => [
                <span>
                  v<sub>{i + 1}</sub>
                </span>,
                v[0],
                v[1],
                v[2],
              ])}
            />
          </Col>
          <Col>
            <MCTable
              title="Atomic positions"
              headerRow={["Kind label", "x [Å]", "y [Å]", "z [Å]"]}
              contents={structureInfo.aiidaAttributes.sites.map((s) => [
                s.kind_name,
                s.position[0],
                s.position[1],
                s.position[2],
              ])}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StructureSection;

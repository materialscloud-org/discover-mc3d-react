import React from "react";

import Table from "react-bootstrap/Table";

import { ExploreButton, StructDownloadButton } from "mc-react-library";

import { EXPLORE_URL } from "../../common/config";

import { Container, Row, Col } from "react-bootstrap";

import "./index.css";

const GeneralBox = ({ details, aiidaRestEndpoint }) => {
  return (
    <div className="info-section">
      <b>General</b>
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
    </div>
  );
};

const StructureSection = (props) => {
  let aiidaRestEndpoint = props.loadedData.aiidaRestEndpoint;
  let details = props.loadedData.details;
  let structureInfo = props.loadedData.structureInfo;

  let floatPrecision = 4;
  return (
    <div>
      <div className="section-heading">Structural details</div>
      <Container fluid className="section-container">
        <Row>
          <Col>
            <div style={{ marginBottom: "15x" }}>
              <GeneralBox
                details={details}
                aiidaRestEndpoint={aiidaRestEndpoint}
              />
            </div>
            <div className="mc-custom-table-heading">Cell</div>
            <div className="mc-custom-table-container">
              <Table>
                <thead>
                  <tr>
                    <th></th>
                    <th>x [Å]</th>
                    <th>y [Å]</th>
                    <th>z [Å]</th>
                  </tr>
                </thead>
                <tbody>
                  {structureInfo.aiidaAttributes.cell.map((v, i) => (
                    <tr key={i}>
                      <td>
                        v<sub>{i + 1}</sub>
                      </td>
                      <td>{v[0].toFixed(floatPrecision)}</td>
                      <td>{v[1].toFixed(floatPrecision)}</td>
                      <td>{v[2].toFixed(floatPrecision)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col>
            <div className="mc-custom-table-heading">Atomic positions</div>
            <div className="mc-custom-table-container">
              <Table>
                <thead>
                  <tr>
                    <th>Kind label</th>
                    <th>x [Å]</th>
                    <th>y [Å]</th>
                    <th>z [Å]</th>
                  </tr>
                </thead>
                <tbody>
                  {structureInfo.aiidaAttributes.sites.map((r, i) => (
                    <tr key={i}>
                      <td>{r.kind_name}</td>
                      <td>{r.position[0].toFixed(floatPrecision)}</td>
                      <td>{r.position[1].toFixed(floatPrecision)}</td>
                      <td>{r.position[2].toFixed(floatPrecision)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StructureSection;

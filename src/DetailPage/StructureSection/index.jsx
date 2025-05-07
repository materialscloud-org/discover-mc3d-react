import React from "react";

import { ExploreButton, StructDownloadButton } from "mc-react-library";

import { CellInfoBox } from "./CellInfo";

import { Container, Row, Col } from "react-bootstrap";

import { MCTable } from "../../common/MCTable";
import { MCInfoBox } from "../../common/MCInfoBox";

import { AIIDA_API_URLS, EXPLORE_URLS } from "../../common/restApiUtils";

const StructureSection = ({ params, loadedData, metadata }) => {
  let details = loadedData.details;
  let structureInfo = loadedData.structureInfo;

  const vol = details.properties.cell_volume;

  return (
    <div>
      <div className="section-heading">Structural details</div>
      <Container fluid className="section-container">
        <Row>
          <Col className="flex-column">
            <div style={{ marginBottom: "10px" }}>
              <div className="subsection-title">General</div>
              <MCInfoBox title="General">
                <ul className="no-bullets">
                  <li>
                    Explore provenance{" "}
                    <ExploreButton
                      explore_url={EXPLORE_URLS[params.method]}
                      uuid={details.general.structure_uuid}
                    />
                  </li>
                  <li>
                    <span>
                      {`Cell volume: ${details.properties.cell_volume.value.toFixed(2)}`}{" "}
                      Å<sup>3</sup>
                    </span>
                  </li>

                  <li>
                    Download structure
                    <StructDownloadButton
                      aiida_rest_url={AIIDA_API_URLS[params.method]}
                      uuid={details.general.structure_uuid}
                    />
                  </li>
                </ul>
              </MCInfoBox>
            </div>
            <CellInfoBox
              structureInfo={structureInfo}
              spacegroup_symbol={details.general.spacegroup_international}
            />
          </Col>
          <Col className="flex-column">
            <div>
              <div className="subsection-title">Atomic positions</div>
              <MCTable
                headerRow={["Kind label", "x [Å]", "y [Å]", "z [Å]"]}
                contents={structureInfo.aiidaAttributes.sites.map((s) => [
                  s.kind_name,
                  s.position[0],
                  s.position[1],
                  s.position[2],
                ])}
                style={{ maxHeight: "340px" }} // Currently hand-picked
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StructureSection;

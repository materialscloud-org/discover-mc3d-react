import React from "react";

import { ExploreButton, StructDownloadButton } from "mc-react-library";

import { CellInfoBox } from "./CellInfo";

import { Container, Row, Col } from "react-bootstrap";

import { MCTable } from "../../common/MCTable";
import { MCInfoBox } from "../../common/MCInfoBox";

import { AIIDA_API_URLS, EXPLORE_URLS } from "../../common/restApiUtils";
import { format_aiida_prop } from "../../common/utils";

const StructureSection = ({ params, loadedData }) => {
  let details = loadedData.details;
  let structureInfo = loadedData.structureInfo;

  const vol = details.properties.cell_volume;
  console.log(loadedData);
  const metadata = loadedData.metadata;
  const methodLabel = params.method;

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
                  <li style={{ marginTop: "-5px", marginBottom: "-4px" }}>
                    Download structure
                    <StructDownloadButton
                      aiida_rest_url={AIIDA_API_URLS[params.method]}
                      uuid={details.general.structure_uuid}
                    />
                  </li>
                  <li style={{ marginBottom: "9px" }}>
                    Explore provenance{" "}
                    <ExploreButton
                      explore_url={EXPLORE_URLS[params.method]}
                      uuid={details.general.structure_uuid}
                    />
                  </li>
                  <li>
                    Cell volume:{" "}
                    {format_aiida_prop(
                      details.properties.cell_volume,
                      metadata.info.properties.cell_volume,
                      methodLabel,
                      2,
                    )}
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
                style={{ maxHeight: "332px" }} // Currently hand-picked
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StructureSection;

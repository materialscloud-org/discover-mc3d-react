import "./index.css";

import StructureVisualizer from "mc-react-structure-visualizer";

import { Container, Row, Col } from "react-bootstrap";

import { formula } from "mc-react-library";

import {
  ExploreButton,
  StructDownloadButton,
  formatChemicalFormula,
  formatSpaceGroupSymbol,
} from "mc-react-library";

import { format_aiida_prop } from "../../common/utils";
import { MCInfoBox } from "../../common/MCInfoBox";

import SourceInfo from "./SourceInfo";

import { AIIDA_API_URLS, EXPLORE_URLS } from "../../common/AIIDArestApiUtils";

function GeneralInfoBox({ details, metadata, methodLabel }) {
  return (
    <MCInfoBox style={{ height: "450px" }}>
      <div>
        <b>Info</b>
        <ul className="no-bullets">
          <li>
            Formula (IUPAC): {formatChemicalFormula(details.general.formula)}
          </li>
          <li>
            Hill formula (full):{" "}
            {formatChemicalFormula(details.general.formula_hill)}
          </li>
          <li>Bravais lattice: {details.general.bravais_lattice}</li>
          <li>
            Space group symbol:{" "}
            {formatSpaceGroupSymbol(details.general.spacegroup_international)}
          </li>
          <li>Space group number: {details.general.spacegroup_number}</li>
        </ul>
      </div>
      <div>
        <b>Source</b>
        <SourceInfo sources={details.source} metadata={metadata} />
      </div>
      <div>
        <b>Properties</b>
        <ul className="no-bullets">
          <li>
            Total energy:{" "}
            {format_aiida_prop(
              details.properties.total_energy,
              metadata.info.properties.total_energy,
              methodLabel,
              2,
            )}
          </li>
          <li>
            Density:{" "}
            {formula.calculateDensity(
              details.general.formula_hill,
              details.properties.cell_volume,
            )}{" "}
            kg/m<sup>3</sup>
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
          <li>
            Total magnetization:{" "}
            {format_aiida_prop(
              details.properties.total_magnetization,
              metadata.info.properties.total_magnetization,
              methodLabel,
              2,
            )}
          </li>
          <li>
            Absolute magnetization:{" "}
            {format_aiida_prop(
              details.properties.absolute_magnetization,
              metadata.info.properties.absolute_magnetization,
              methodLabel,
              2,
            )}
          </li>
        </ul>
      </div>
    </MCInfoBox>
  );
}

const StructureViewerBox = ({ uuid, structureInfo, methodLabel }) => {
  return (
    <>
      <div className="subsection-title">
        Structure{" "}
        <ExploreButton explore_url={EXPLORE_URLS[methodLabel]} uuid={uuid} />
      </div>
      <div className="structure-view-box subsection-shadow">
        <StructureVisualizer
          cifText={structureInfo.cif}
          initSupercell={[2, 2, 2]}
        />
        <div className="download-button-container">
          <StructDownloadButton
            aiida_rest_url={AIIDA_API_URLS[methodLabel]}
            uuid={uuid}
          />
        </div>
      </div>
    </>
  );
};

function OverviewSection({ params, loadedData, headerStyle = {} }) {
  return (
    <div>
      <div className="section-heading" style={headerStyle}>
        General overview
      </div>
      <Container fluid className="section-container">
        <Row>
          <Col className="flex-column">
            <StructureViewerBox
              uuid={loadedData.details.general.structure_uuid}
              structureInfo={loadedData.structureInfo}
              methodLabel={params.method}
            />
          </Col>
          <Col className="flex-column">
            <div style={{ marginTop: "35px" }}>
              <GeneralInfoBox
                details={loadedData.details}
                metadata={loadedData.metadata}
                methodLabel={params.method}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OverviewSection;

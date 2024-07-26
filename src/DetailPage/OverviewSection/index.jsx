import React from "react";

import "./index.css";

import StructureVisualizer from "mc-react-structure-visualizer";

import { Container, Row, Col } from "react-bootstrap";

import {
  ExploreButton,
  StructDownloadButton,
  formatChemicalFormula,
  formatSpaceGroupSymbol,
} from "mc-react-library";

import { EXPLORE_URL } from "../../common/config";

import SourceInfo from "./SourceInfo";

function InfoBox({ details, metadata }) {
  function format_aiida_prop(property, metadata, prec = 3, factor = 1) {
    if (property == null) {
      return <span>N/A</span>;
    }
    let val = property.value ?? 0.0;
    val *= factor;
    let valStr = val.toFixed(prec);
    if (metadata.unit) {
      valStr += ` ${metadata.unit}`;
    }
    return (
      <span>
        {valStr}{" "}
        <ExploreButton explore_url={EXPLORE_URL} uuid={property.uuid ?? null} />
      </span>
    );
  }

  return (
    <div className="info-box">
      <div>
        <b>Info</b>
        <ul className="no-bullets">
          <li>Formula: {formatChemicalFormula(details.general.formula)}</li>
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
              2,
            )}
          </li>
          <li>
            Cell volume:{" "}
            {format_aiida_prop(
              details.properties.cell_volume,
              metadata.info.properties.cell_volume,
              2,
            )}
          </li>
          <li>
            Total magnetization:{" "}
            {format_aiida_prop(
              details.properties.total_magnetization,
              metadata.info.properties.total_magnetization,
              2,
            )}
          </li>
          <li>
            Absolute magnetization:{" "}
            {format_aiida_prop(
              details.properties.absolute_magnetization,
              metadata.info.properties.absolute_magnetization,
              2,
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

const StructureViewerBox = ({ uuid, structureInfo, aiidaRestEndpoint }) => {
  return (
    <div className="structure-view-section">
      <div className="subsection-title-container">
        <b>Structure</b> <ExploreButton explore_url={EXPLORE_URL} uuid={uuid} />
      </div>
      <StructureVisualizer
        cifText={structureInfo.cif}
        initSupercell={[2, 2, 2]}
      />
      <div className="download-button-container">
        <StructDownloadButton aiida_rest_url={aiidaRestEndpoint} uuid={uuid} />
      </div>
    </div>
  );
};

function OverviewSection(props) {
  let aiidaRestEndpoint = props.loadedData.aiidaRestEndpoint;
  let details = props.loadedData.details;
  let metadata = props.loadedData.metadata;
  let structureInfo = props.loadedData.structureInfo;

  return (
    <div>
      <div className="section-heading">General overview</div>
      <Container fluid className="section-container">
        <Row>
          <Col>
            <StructureViewerBox
              uuid={details.general.uuid_structure}
              structureInfo={structureInfo}
              aiidaRestEndpoint={aiidaRestEndpoint}
            />
          </Col>
          <Col>
            <div className="general-info-section">
              <InfoBox details={details} metadata={metadata} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OverviewSection;

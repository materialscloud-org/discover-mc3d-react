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

import { MCInfoBox } from "../../common/MCInfoBox";

import SourceInfo from "./SourceInfo";

import { AIIDA_API_URLS, EXPLORE_URLS } from "../../common/restApiUtils";

function GeneralInfoBox({ details, metadata, methodLabel }) {
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
        <ExploreButton
          explore_url={EXPLORE_URLS[methodLabel]}
          uuid={property.uuid ?? null}
        />
      </span>
    );
  }

  return (
    <MCInfoBox style={{ height: "450px" }}>
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

function OverviewSection({ params, loadedData }) {
  return (
    <div>
      <div className="section-heading">General overview</div>
      <Container fluid className="section-container">
        <Row>
          <Col className="flex-column">
            <StructureViewerBox
              uuid={loadedData.details.general.uuid_structure}
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

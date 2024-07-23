import React from "react";

import Table from "react-bootstrap/Table";

import { ExploreButton, StructDownloadButton } from "mc-react-library";

import { EXPLORE_URL } from "../../common/config";

import "./index.css";

const StructureSection = (props) => {
  let aiidaRestEndpoint = props.loadedData.aiidaRestEndpoint;
  let details = props.loadedData.details;
  let structureInfo = props.loadedData.structureInfo;

  let floatPrecision = 4;
  return (
    <div>
      <div className="section-heading">Structural details</div>
      <div className="structure-section">
        <b>Structural information</b>{" "}
        <ExploreButton
          explore_url={EXPLORE_URL}
          uuid={details.general.uuid_structure}
        />
        <div className="ssec-download-button-container">
          Download
          <StructDownloadButton
            aiida_rest_url={aiidaRestEndpoint}
            uuid={details.general.uuid_structure}
          />
        </div>
        <div className="structure-section-inner">
          <div>
            <p>Cell</p>
            <Table bordered size="sm">
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
          <div>
            <p>Atomic positions</p>
            <div className="atomic-pos-table">
              <Table bordered size="sm">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructureSection;

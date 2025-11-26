import { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { DoiBadge } from "mc-react-library";

import { CitationsList } from "../../common/CitationsList";
import PhononVisualizer from "mc-react-phonon-visualizer";

import { loadSuperConPhononVis } from "../../common/MCrestApiUtils";

import { WarningBoxOtherMethod } from "../../common/WarningBox";

import prettifyLabels from "./prettifyPVlabels";
import { McloudSpinner } from "mc-react-library";

import { MCInfoBox } from "../../common/MCInfoBox";
import { TwoWideInfoBox } from "../../common/TwoWideInfoBox";

import formatIfExists from "../../common/resultFormatter";

export default function VibrationalSection({ params, loadedData, phononData }) {
  // if data doesnt exist dont render.
  if (!phononData) return null;

  const pdInfo = phononData?.scDetails?.phonons || null;
  const vibCalcInfo = [
    {
      key: (
        <>
          E<sub>cut</sub>
        </>
      ),
      value: formatIfExists({
        value: pdInfo.ecut,
        format: (v) => `${(v / 13.605703976).toFixed(0)} Ry`,
      }),
    },
    {
      key: (
        <>
          <b>k</b>-grid
        </>
      ),
      value: formatIfExists({
        value: pdInfo.kgrid_dfpt.mesh,
        uuid: pdInfo.kgrid_dfpt.uuid,
        format: (v) => (Array.isArray(v) ? v.join(" × ") : `${v}`),
      }),
    },
    {
      key: (
        <>
          <b>q</b>-grid
        </>
      ),
      value: formatIfExists({
        value: pdInfo.qgrid_dfpt.mesh,
        uuid: pdInfo.qgrid_dfpt.uuid,
        format: (v) => (Array.isArray(v) ? v.join(" × ") : `${v}`),
      }),
    },
  ];

  const vibResInfo = [
    {
      key: "Smearing",
      value: formatIfExists({
        value: pdInfo.scf_smearing,
        format: (v) => `${v} eV`,
      }),
    },
    {
      key: "Fermi energy",
      value: formatIfExists({
        value: pdInfo.fermi_energy_coarse,
        format: (v) => `${v} eV`,
      }),
    },
    {
      key: (
        <>
          ω<sup>max</sup>
        </>
      ),
      value: formatIfExists({
        value: pdInfo.matdyn_highest_phonon_frequency,
        format: (v) => `${v} meV`,
      }),
    },
  ];

  const [phononVisData, setPhononVisData] = useState(null);
  const [notAvail, setNotAvail] = useState(false);
  const [loading, setLoading] = useState(true);

  const method = phononData.method;

  useEffect(() => {
    setLoading(true);

    // supercon phonons is in CM1 WE WANT MEV
    loadSuperConPhononVis(method, params.id)
      .then((loadedSCPVis) => {
        if (loadedSCPVis) {
          const CM1_TO_MEV = 0.12398;

          // Convert eigenvalues to meV
          const convertedEigenvalues = loadedSCPVis.eigenvalues?.map(
            (bandArray) => bandArray.map((val) => val * CM1_TO_MEV),
          );

          setPhononVisData({
            ...loadedSCPVis,
            eigenvalues: convertedEigenvalues,
            highsym_qpts: loadedSCPVis.highsym_qpts?.map(prettifyLabels),
          });
        } else {
          setNotAvail(true);
        }
      })
      .finally(() => setLoading(false));
  }, [params, loadedData]);

  let content;

  if (notAvail) {
    // dont render if something went wrong.
    return null;
  } else if (loading) {
    content = (
      <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
        <McloudSpinner />
      </div>
    );
  } else if (phononVisData) {
    content = (
      <PhononVisualizer
        key={JSON.stringify(phononVisData)}
        props={{
          plotlyLayoutFormat: {
            xaxis: {
              title: {},
            },
            yaxis: {
              title: {
                text: "Energy [meV]",
              },
            },
          },
          ...phononVisData,
        }}
      />
    );
  }

  return (
    <div>
      <div
        style={{
          margin: "10px 0px",
          padding: "20px 0px 10px",
          borderBottom: "1px solid #c4c4c4",
        }}
      >
        <div style={{ fontSize: "24px" }}>Vibrational properties</div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2px",
            alignItems: "center",
          }}
        >
          <CitationsList citationLabels={["MBercxSupercon25"]} />
          <DoiBadge doi_id="9w-az" label="Data DOI" />
        </div>
      </div>

      {params.method !== method && (
        <WarningBoxOtherMethod method={method} id={params.id} />
      )}
      <Container fluid className="section-container">
        <div style={{ padding: "10px 10px", textAlign: "justify" }}>
          This dataset provides results from a high-throughput search for
          phonon-mediated superconductivity, where electron–phonon interactions
          and critical temperatures were systematically computed to identify and
          characterize promising superconducting materials. This frontend
          section shows phonon vibrational modes. For further details regarding
          the methodology see the{" "}
          <a href="./#/contributions" target="_blank" rel="noopener noreferrer">
            extended dataset documentation
          </a>
          .
        </div>
        <Row>
          <Col sm={12} style={{ maxWidth: "600px" }}>
            <div className="subsection-title">Info</div>

            <TwoWideInfoBox
              style={{ height: "110px", marginBottom: "20px" }}
              childrenLeft={
                <div>
                  <ul className="no-bullets">
                    {vibCalcInfo
                      .filter((item) => item.value !== undefined)
                      .map((item, idx) => (
                        <li key={idx}>
                          {item.key}: {item.value}
                        </li>
                      ))}
                  </ul>
                </div>
              }
              childrenRight={
                <div>
                  <ul className="no-bullets">
                    {vibResInfo
                      .filter((item) => item.value !== undefined)
                      .map((item, idx) => (
                        <li key={idx}>
                          {item.key}: {item.value}
                        </li>
                      ))}
                  </ul>
                </div>
              }
            />
          </Col>
        </Row>

        <Row>
          <div className="subsection-title">
            Interactive phonon visualization
          </div>
          {content}
        </Row>
      </Container>
    </div>
  );
}

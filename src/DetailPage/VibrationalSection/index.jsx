import { useEffect, useState } from "react";
import { Row, Container } from "react-bootstrap";
import { DoiBadge } from "mc-react-library";

import { CitationsList } from "../../common/CitationsList";
import PhononVisualizer from "mc-react-phonon-visualizer";

import { loadSuperConPhononVis } from "../../common/MCrestApiUtils";

import prettifyLabels from "./prettifyPVlabels";
import { McloudSpinner } from "mc-react-library";

export default function VibrationalSection({ params, loadedData }) {
  const [phononVisData, setPhononVisData] = useState(null);
  const [notAvail, setNotAvail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // supercon phonons is in CM1 WE WANT MEV
    loadSuperConPhononVis(params.method, params.id)
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
          <div className="subsection-title">
            Interactive phonon visualization
          </div>
          {content}
        </Row>
      </Container>
    </div>
  );
}

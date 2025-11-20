import { useEffect, useState } from "react";
import { Row, Container } from "react-bootstrap";
import { DoiBadge } from "mc-react-library";

import { CitationsList } from "../../common/CitationsList";
import PhononVisualizer from "mc-react-phonon-visualizer";

import { loadSuperConPhononVis } from "../../common/MCrestApiUtils";

import prettifyLabels from "./prettifyPVlabels";
import { McloudSpinner } from "mc-react-library";

export default function VibrationalSection({ params, loadedData, phononData }) {
  if (!phononData) return null;

  const [phononVisData, setPhononVisData] = useState(null);
  const [notAvail, setNotAvail] = useState(false);
  const [loading, setLoading] = useState(true);

  const method = phononData.method;

  // Warning if the vib method is different from the current method
  const differentMethodWarning =
    params.method !== method ? (
      <div
        className="alert alert-warning"
        style={{ margin: "10px 10px 5px 10px" }}
        role="alert"
      >
        {" "}
        Warning: Vibrational properties have been calculated from the final
        structure seen for
        <strong>{method}</strong> which may differ to this structure (
        <strong>{params.method}</strong>.).
      </div>
    ) : null;

  useEffect(() => {
    setLoading(true);

    loadSuperConPhononVis(phononData.method, params.id)
      .then((loadedSCPVis) => {
        if (loadedSCPVis) {
          setPhononVisData({
            ...loadedSCPVis,
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
        props={{ ...phononVisData }}
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
        {differentMethodWarning}
      </div>
      <Container fluid className="section-container">
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

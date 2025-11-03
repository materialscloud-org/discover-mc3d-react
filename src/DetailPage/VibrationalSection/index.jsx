import { useEffect, useState } from "react";
import { Row, Container } from "react-bootstrap";
import { DoiBadge } from "mc-react-library";

import { CitationsList } from "../../common/CitationsList";

import PhononVisualizer from "mc-react-phonon-visualizer";
import { loadSuperConPhononVis } from "../../common/restApiUtils";

import prettifyLabels from "./prettifyPVlabels";

export default function VibrationalSection({ params, loadedData }) {
  const [phononVisData, setPhononVisData] = useState(null);

  useEffect(() => {
    loadSuperConPhononVis(params.method, params.id).then((data) => {
      if (!data) return;

      const prettyData = {
        ...data,
        highsym_qpts: data.highsym_qpts?.map(prettifyLabels),
      };
      setPhononVisData(prettyData);
    });
  }, []);

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
        <Row>
          <div>
            <div className="subsection-title">
              Interactive phonon visualization
            </div>
          </div>
          {phononVisData && (
            <PhononVisualizer
              key={JSON.stringify(phononVisData)}
              props={{
                title: "Demo",
                fastMode: true,
                ...phononVisData,
              }}
            />
          )}
        </Row>
      </Container>
    </div>
  );
}

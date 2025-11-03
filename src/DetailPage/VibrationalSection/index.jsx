import { useEffect, useState } from "react";
import { Row, Container } from "react-bootstrap";
import { DoiBadge } from "mc-react-library";

import { CitationsList } from "../../common/CitationsList";
import PhononVisualizer from "mc-react-phonon-visualizer";
import { loadSuperConPhononVis } from "../../common/restApiUtils";

import prettifyLabels from "./prettifyPVlabels";
import { McloudSpinner } from "mc-react-library";

export default function VibrationalSection({ params, loadedData }) {
  const [phononVisData, setPhononVisData] = useState(null);
  const [notAvail, setNotAvail] = useState(true); // only some have a notAvail state

  useEffect(() => {
    if (!params?.supercon) {
      setNotAvail(true);
      return; // exit early
    }

    setNotAvail(false); //supercon exists

    loadSuperConPhononVis(params.method, params.id).then((loadedSCPVis) => {
      if (loadedSCPVis) {
        const prettyData = {
          ...loadedSCPVis,
          highsym_qpts: loadedSCPVis.highsym_qpts?.map(prettifyLabels),
        };
        setPhononVisData(prettyData);
      } else {
        setNotAvail(true); // set to true if something went wrong.
      }
    });
  }, [params?.supercon, params.method, params.id]);

  let content;
  if (notAvail) {
    return <div className="empty-vibrationsection-div" />;
  } else if (phononVisData == null) {
    content = (
      <div
        style={{
          width: "150px",
          height: "400px",
          padding: "40px",
          margin: "0 auto",
        }}
      >
        <McloudSpinner />
      </div>
    );
  } else {
    content = (
      <PhononVisualizer
        key={JSON.stringify(phononVisData)}
        props={{ title: "Demo", fastMode: true, ...phononVisData }}
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
        <Row>
          <div>
            <div className="subsection-title">
              Interactive phonon visualization
            </div>
          </div>
          {content}
        </Row>
      </Container>
    </div>
  );
}

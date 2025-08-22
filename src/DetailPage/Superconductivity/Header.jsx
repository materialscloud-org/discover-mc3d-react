import { ExploreButton } from "mc-react-library";
import { DoiBadge } from "mc-react-library";

import { EXPLORE_URLS } from "../../common/restApiUtils";

import { CitationsList } from "../../common/CitationsList";

export function SuperconHeader({ params, superconData }) {
  return (
    <>
      <div
        className="title-and-doi"
        style={{
          borderBottom: "1px solid grey",
          paddingBottom: "0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "0.25rem",
        }}
      >
        <span className="title-span">Superconductivity Estimation</span>
        <div
          className="doi-container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginLeft: "0.5rem",
          }}
        >
          <CitationsList citationLabels={["MBercx25"]} />
          <DoiBadge doi_id="9w-az" label="Data DOI" />
        </div>
      </div>
      <div
        className="alert alert-warning"
        style={{ margin: "10px 10px 5px 10px" }}
        role="alert"
      >
        This contribution re-relaxes the structure with a different methodology.
        To see this structure and the provenance:{" "}
        {superconData?.a2f_uuid && (
          <ExploreButton
            explore_url={EXPLORE_URLS[params.method] + "-supercon"}
            uuid={superconData.structure_uuid}
          />
        )}
      </div>
      <div style={{ padding: "10px 10px" }}>
        This dataset provides results from a high-throughput search for
        phonon-mediated superconductivity, where electron–phonon interactions
        and critical temperatures were systematically computed to identify and
        characterize promising superconducting materials. This frontend section
        contains the final superconductivity estimation results, as well as the
        intermediate electronic and vibrational calculated properties.
      </div>
    </>
  );
}

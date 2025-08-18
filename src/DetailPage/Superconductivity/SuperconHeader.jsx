import { ExploreButton } from "mc-react-library";
import { DoiBadge } from "mc-react-library";

import { EXPLORE_URLS } from "../../common/restApiUtils";

export function SuperconHeader({ params, superconData }) {
  return (
    <>
      <div className="section-heading">Contribution: Superconductivity</div>
      <div style={{ padding: "10px 10px" }}>
        Superconduction properities have been been provided by Bercx et al, for
        details on methodology see{" "}
        <a href="#/contributions" target="_blank">
          {" "}
          contributions
        </a>
        . If using any of the data in this section be sure to cite: <br></br>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <a
            style={{
              textDecoration: "none",
              color: "rgb(48, 63, 159)",
              fontWeight: "500",
            }}
            href="https://arxiv.org/abs/2503.10943"
            target="_blank"
          >
            Charting the landscape of BCS superconductors (arXiv:2503.10943)
          </a>
          <DoiBadge doi_id="9w-az" />
        </div>
      </div>
      <div
        className="alert alert-warning"
        style={{ margin: "20px 10px" }}
        role="alert"
      >
        The methodology for this section re-relaxes the structure using a
        different pseudopotential. To see the relaxed structure of this section,
        you can explore the provenance.{" "}
        {superconData?.a2f_uuid && (
          <ExploreButton
            explore_url={EXPLORE_URLS[params.method] + "-supercon"}
            uuid={superconData.structure_uuid}
          />
        )}
      </div>
    </>
  );
}

import { ExploreButton } from "mc-react-library";
import { DoiBadge } from "mc-react-library";

import { EXPLORE_URLS } from "../../common/restApiUtils";

export function SuperconHeader({ params, superconData }) {
  return (
    <>
      <div className="section-heading">Contribution: Superconductivity</div>
      <div style={{ padding: "10px 10px" }}>
        This is a contributed section. For more information and if using any of
        this data, please cite:
        <p style={{ marginTop: "8px", marginLeft: "8px" }}>
          M. Bercx, S. Poncé, Y. Zhang, G. Trezza, A. G. Ghezeljehmeidan, L.
          Bastonero, J. Qiao, F. O. von Rohr, G. Pizzi, E. Chiavazzo, and N.
          Marzari, Charting the landscape of Bardeen-Cooper-Schrieffer
          superconductors in experimentally known compounds, PRX Energy (2025){" "}
          <a
            style={{
              textDecoration: "none",
              color: "rgb(48, 63, 159)",
              fontWeight: "500",
            }}
            href="https://arxiv.org/abs/2503.10943"
            target="_blank"
          >
            https://doi.org/10.1103/sb28-fjc9
          </a>
        </p>
        <p style={{ marginTop: "8px", marginLeft: "8px" }}>
          M. Bercx, S. Poncé, Y. Zhang, G. Trezza, A. G. Ghezeljehmeidan, L.
          Bastonero, J. Qiao, F. O. von Rohr, G. Pizzi, E. Chiavazzo, and N.
          Marzari, Charting the landscape of Bardeen-Cooper-Schrieffer
          superconductors in experimentally known compounds, arXiv:2503.10943
          (2025).{" "}
          <a
            style={{
              textDecoration: "none",
              color: "rgb(48, 63, 159)",
              fontWeight: "500",
            }}
            href="https://arxiv.org/abs/2503.10943"
            target="_blank"
          >
            https://arxiv.org/abs/2503.10943
          </a>
        </p>
        <p
          style={{
            marginTop: "8px",
            marginLeft: "8px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>
            This data is also available on the Materials Cloud archive:
          </span>
          <DoiBadge doi_id="9w-az" />
        </p>
      </div>
      <div
        className="alert alert-warning"
        style={{ margin: "0px 10px 20px" }}
        role="alert"
      >
        The calculations for this section re-relaxes the structure using a
        different pseudopotential table (PBE PseudoDojo v0.5). To see the
        relaxed structure of this section, you can explore the provenance.{" "}
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

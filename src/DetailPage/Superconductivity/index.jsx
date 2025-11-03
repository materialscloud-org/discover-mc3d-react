import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { CitationsList } from "../../common/CitationsList";
import { DoiBadge, ExploreButton } from "mc-react-library";
import { EXPLORE_URLS } from "../../common/restApiUtils";

import "./index.css";

import SuperconInfoBox from "./InfoBoxes";
import GapFunction from "./GapFunction";
import { getA2FTraces } from "./getA2FTraces";

import BandStructure from "../../common/BandStructure/BandStructure";
import {
  normalizeBandsData,
  prepareSuperConBand,
} from "../../common/BandStructure/utils";

import {
  SUPERCON_BANDS_LAYOUT_CONFIG,
  SUPERCON_PHONON_A2F_LAYOUT_CONFIG,
} from "../../common/BandStructure/configs";

import { loadAiidaBands, loadXY } from "../../common/restApiUtils";

/**
 * Custom hook to load async data safely with cancellation support.
 */
function useAsyncData(fetcher, deps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      try {
        const result = await fetcher();
        if (!cancelled) setData(result ?? null);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, deps);
  return [data, loading];
}

/**
 * Prepares bands safely or returns null.
 */
function safePrepareBands(bands, fermi, configName) {
  if (!bands || typeof fermi !== "number") return null;
  return prepareSuperConBand(bands, -fermi, configName);
}

export default function SuperConductivity({ params, loadedData }) {
  const supercon = loadedData?.details?.supercon;

  // --- Gap function fetcher ---
  const gapfuncFetcher = useCallback(async () => {
    if (!supercon.aniso_gap_function_uuid) return null;
    return loadXY(
      `${params.method}-supercon`,
      supercon.aniso_gap_function_uuid,
    );
  }, [params.method]);

  const [gapfuncData, gapfuncLoading] = useAsyncData(gapfuncFetcher, [
    gapfuncFetcher,
  ]);

  // --- A2F fetcher ---
  const a2fFetcher = useCallback(async () => {
    if (!supercon.a2f_uuid) return null;
    return loadXY(`${params.method}-supercon`, supercon.a2f_uuid);
  }, [params.id]);

  const [a2fData] = useAsyncData(a2fFetcher, [a2fFetcher]);

  // --- Bands fetcher ---
  const bandsFetcher = useCallback(async () => {
    const method = `${params.method}-supercon`;

    const [epwBands, qeBands, phBands] = await Promise.all([
      supercon.epw_el_band_structure_uuid
        ? loadAiidaBands(method, supercon.epw_el_band_structure_uuid)
        : null,
      supercon.qe_el_band_structure_uuid
        ? loadAiidaBands(method, supercon.qe_el_band_structure_uuid)
        : null,
      supercon.epw_ph_band_structure_uuid
        ? loadAiidaBands(method, supercon.epw_ph_band_structure_uuid)
        : null,
    ]);

    const preppedEPW = safePrepareBands(
      epwBands,
      supercon.fermi_energy_coarse,
      "electronicEPW",
    );
    const preppedQE = safePrepareBands(
      qeBands,
      supercon.fermi_energy_coarse,
      "electronicQE",
    );

    const rescaledFilteredBDArray = normalizeBandsData(
      [preppedQE, preppedEPW].filter(Boolean),
    );
    const preppedPh = safePrepareBands(phBands, 0, "phononEPW");

    return {
      el: rescaledFilteredBDArray,
      ph: preppedPh ? [preppedPh] : [],
    };
  }, [params.method]);

  const [bandsResult, bandsLoading] = useAsyncData(bandsFetcher, [
    bandsFetcher,
  ]);

  const bandsDataArray = bandsResult?.el ?? [];
  const phononBandsArray = bandsResult?.ph ?? [];

  console.log("aniso_info", supercon.aniso_info);

  if (!supercon) return <div className="empty-supercon-div" />;

  return (
    <div>
      <Container fluid className="section-container">
        <div
          style={{
            margin: "10px 0px",
            padding: "20px 0px 10px",
            borderBottom: "1px solid #c4c4c4",
          }}
        >
          <div style={{ fontSize: "24px" }}>Superconductivity estimation</div>
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

        <div
          className="alert alert-warning"
          style={{ margin: "10px 10px 5px 10px" }}
          role="alert"
        >
          This contribution re-relaxes the structure with a different
          methodology. To see this structure, explore the AiiDA provenance{" "}
          {supercon.a2f_uuid && (
            <ExploreButton
              explore_url={EXPLORE_URLS[params.method] + "-supercon"}
              uuid={supercon.structure_uuid}
            />
          )}
        </div>
        <div style={{ padding: "10px 10px" }}>
          This dataset provides results from a high-throughput search for
          phonon-mediated superconductivity, where electron–phonon interactions
          and critical temperatures were systematically computed to identify and
          characterize promising superconducting materials. This frontend
          section contains the final superconductivity estimation results, as
          well as the intermediate electronic and vibrational calculated
          properties. For further details regarding the methodology see the{" "}
          <a href="./#/contributions" target="_blank" rel="noopener noreferrer">
            contribution details
          </a>
          .
        </div>

        {/* Info box and electronic bands */}
        <Row>
          {/* Looks bad on sm/md breakpoints but also md/lg breakpoints look bad too... */}
          <Col sm={12} md={6} className="mt-2 mt-md-5">
            <SuperconInfoBox superconData={supercon} />
          </Col>
          <Col sm={12} md={6} className="mt-3 mt-md-0">
            <div className="subsection-title">Electronic band structure</div>
            <div className="mb-3 ms-2">
              Electronic band structure calculated with Quantum ESPRESSO (QE)
              and EPW.
            </div>
            <BandStructure
              bandsDataArray={bandsDataArray}
              loading={bandsLoading}
              minYval={-10.4}
              maxYval={10.8}
              layoutOverrides={SUPERCON_BANDS_LAYOUT_CONFIG}
            />
          </Col>
        </Row>

        {/* Phonon bands and e-p interaction */}
        {a2fData && (
          <Row>
            <div className="subsection-title">
              Phonon bands and electron-phonon interaction
            </div>
            <div style={{ padding: "0px 10px" }}>
              Phonon band structure calculated with EPW, Eliashberg spectral
              function [α²F(ω)], and electron-phonon coupling strength [λ(ω)].
            </div>

            <BandStructure
              bandsDataArray={phononBandsArray}
              minYval={0}
              maxYval={
                supercon.highest_phonon_frequency != null
                  ? Math.min(supercon.highest_phonon_frequency + 2, 100)
                  : 100
              }
              dosDataArray={[
                {
                  dosData: { x: [0], y: [0] }, // fake dosData.
                  traceFormat: {
                    name: "",
                    legend: "legend2", // draw legend on axisTwo.
                    showlegend: false,
                    opacity: 0,
                  },
                },
              ]}
              loading={bandsLoading}
              layoutOverrides={SUPERCON_PHONON_A2F_LAYOUT_CONFIG}
              // draw traces on fake dos.
              customTraces={getA2FTraces({
                a2f: a2fData?.a2f,
                frequency: a2fData?.frequency,
                degaussq: a2fData?.degaussq,
                lambda: a2fData?.lambda,
              })}
            />
          </Row>
        )}

        {/* Anisotropic gap function. */}
        {supercon.aniso_info && (
          <Row>
            <Col xs={12} style={{ maxWidth: "1200px" }}>
              <div className="subsection-title">
                Anisotropic superconducting gap function
              </div>
              <GapFunction
                gapfuncData={gapfuncData}
                verts={supercon.aniso_info.temps}
                points={supercon.aniso_info.average_deltas}
                delta0={supercon.aniso_info.delta0}
                Tc={supercon.aniso_info.Tc}
                expo={supercon.aniso_info.expo}
                minXVal={0}
                maxXVal={null}
                minYVal={0}
                maxYVal={null}
              />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

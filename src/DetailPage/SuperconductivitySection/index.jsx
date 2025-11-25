import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";

import {
  useAsyncEffect,
  fetchBands,
  fetchGapFunc,
  fetchA2F,
} from "./fetchLogic";

import { CitationsList } from "../../common/CitationsList";
import { DoiBadge, ExploreButton } from "mc-react-library";
import { EXPLORE_URLS } from "../../common/AIIDArestApiUtils";

import SuperconInfoBox from "./InfoBoxes";
import GapFunction from "./GapFunction";
import { getA2FTraces } from "./getA2FTraces";

import BandStructure from "../../common/BandStructure/BandStructure";

import {
  SUPERCON_BANDS_LAYOUT_CONFIG,
  SUPERCON_PHONON_A2F_LAYOUT_CONFIG,
} from "../../common/BandStructure/configs";

// Main component
export default function SuperConductivitySection({
  params,
  loadedData,
  superconData,
}) {
  const supercon = superconData.supercon;

  const method = params.method;

  // --- Bands ---
  const { data: bandsResults, loading: bandsLoading } = useAsyncEffect(
    () => fetchBands(supercon, method),
    [supercon, method],
  );

  // --- Gap function ---
  const { data: gapfuncData, loading: gapfuncLoading } = useAsyncEffect(
    () => fetchGapFunc(supercon, method),
    [supercon, method],
  );

  // --- A2F ---
  const { data: a2fData } = useAsyncEffect(
    () => fetchA2F(supercon, method),
    [supercon, method],
  );

  const bandsDataArray = bandsResults?.el ?? [];
  const phononBandsArray = bandsResults?.ph ?? [];

  const hasElecBands = !!bandsDataArray.length;
  const hasPhBands = !!phononBandsArray.length;

  // fallback if nothing exists.
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
          {supercon.structure_uuid && (
            <ExploreButton
              explore_url={EXPLORE_URLS["pbesol-v1-supercon"]}
              uuid={supercon.structure_uuid}
            />
          )}
        </div>
        <div style={{ padding: "10px 10px", textAlign: "justify" }}>
          This dataset provides results from a high-throughput search for
          phonon-mediated superconductivity, where electron–phonon interactions
          and critical temperatures were systematically computed to identify and
          characterize promising superconducting materials. This frontend
          section contains the final superconductivity estimation results, as
          well as the intermediate electronic and vibrational calculated
          properties. For further details regarding the methodology see the{" "}
          <a href="./#/contributions" target="_blank" rel="noopener noreferrer">
            extended dataset documentation
          </a>
          .
        </div>

        {/* Info box and electronic bands */}
        <Row>
          {/* Looks bad on sm/md breakpoints but also md/lg breakpoints look bad too... */}
          <Col sm={12} md={6} className="mt-2 mt-md-5">
            <SuperconInfoBox params={params} superconData={supercon} />
          </Col>
          <Col sm={12} md={6} className="mt-3 mt-md-0">
            <div className="subsection-title">Electronic band structure</div>
            <div className="mb-3 ms-2">
              Calculated with Quantum ESPRESSO (QE){" "}
              {supercon.qe_el_band_structure_uuid && (
                <ExploreButton
                  explore_url={EXPLORE_URLS["pbesol-v1-supercon"]}
                  uuid={supercon.qe_el_band_structure_uuid}
                />
              )}{" "}
              and EPW{" "}
              {supercon.epw_el_band_structure_uuid && (
                <ExploreButton
                  explore_url={EXPLORE_URLS["pbesol-v1-supercon"]}
                  uuid={supercon.epw_el_band_structure_uuid}
                />
              )}
            </div>
            <BandStructure
              bandsDataArray={hasElecBands ? bandsResults.el : null}
              loading={bandsLoading}
              minYval={-10.4}
              maxYval={10.8}
              layoutOverrides={SUPERCON_BANDS_LAYOUT_CONFIG}
            />
          </Col>
        </Row>

        {/* Phonon bands and e-p interaction */}
        {supercon.epw_ph_band_structure_uuid && (
          <Row>
            <Col className="mt-4 mt-lg-0">
              <div className="subsection-title">
                Phonon bands and electron-phonon interaction
              </div>
              <div style={{ padding: "0px 10px" }}>
                Phonon band structure calculated with EPW{" "}
                {supercon.epw_ph_band_structure_uuid && (
                  <ExploreButton
                    explore_url={EXPLORE_URLS[params.method] + "-supercon"}
                    uuid={supercon.epw_ph_band_structure_uuid}
                  />
                )}{" "}
                Eliashberg spectral function [α²F(ω)], and electron-phonon
                coupling strength [λ(ω)]{" "}
                {supercon.a2f_uuid && (
                  <ExploreButton
                    explore_url={EXPLORE_URLS[params.method] + "-supercon"}
                    uuid={supercon.a2f_uuid}
                  />
                )}{" "}
              </div>

              <BandStructure
                bandsDataArray={hasPhBands ? bandsResults.ph : null}
                loading={bandsLoading}
                loadingIconScale={7}
                minYval={0}
                maxYval={supercon.highest_phonon_frequency + 2}
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
                layoutOverrides={SUPERCON_PHONON_A2F_LAYOUT_CONFIG}
                // draw traces on fake dos.
                customTraces={getA2FTraces({
                  a2f: a2fData?.a2f,
                  frequency: a2fData?.frequency,
                  degaussq: a2fData?.degaussq,
                  lambda: a2fData?.lambda,
                })}
              />
            </Col>
          </Row>
        )}

        {/* Anisotropic gap function. */}
        {supercon.aniso_info && (
          <Row>
            <Col style={{ maxWidth: "910px" }}>
              <div className="subsection-title">
                Anisotropic superconducting gap function{" "}
                {supercon.aniso_gap_function_uuid && (
                  <ExploreButton
                    explore_url={EXPLORE_URLS[params.method] + "-supercon"}
                    uuid={supercon.aniso_gap_function_uuid}
                  />
                )}{" "}
              </div>
              <GapFunction
                gapfuncData={gapfuncData}
                loading={gapfuncLoading}
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

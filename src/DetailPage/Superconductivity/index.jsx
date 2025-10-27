import { useState, useEffect, useCallback } from "react";
import { Container, Row } from "react-bootstrap";

import "./index.css";

import TitledColumn from "./TitledColumn";
import { SuperconHeader } from "./Header";
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps); // deps are explicitly passed
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
  }, [params.method, supercon.aniso_gap_function_uuid]);

  const [gapfuncData, gapfuncLoading] = useAsyncData(gapfuncFetcher, [
    gapfuncFetcher,
  ]);

  // --- A2F fetcher ---
  const a2fFetcher = useCallback(async () => {
    if (!supercon.a2f_uuid) return null;
    return loadXY(`${params.method}-supercon`, supercon.a2f_uuid);
  }, [params.method, supercon.a2f_uuid]);

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
  }, [
    params.method,
    supercon.epw_el_band_structure_uuid,
    supercon.qe_el_band_structure_uuid,
    supercon.epw_ph_band_structure_uuid,
    supercon.fermi_energy_coarse,
  ]);

  const [bandsResult, bandsLoading] = useAsyncData(bandsFetcher, [
    bandsFetcher,
  ]);

  const bandsDataArray = bandsResult?.el ?? [];
  const phononBandsArray = bandsResult?.ph ?? [];

  if (!supercon) return <div className="empty-supercon-div" />;

  return (
    <div>
      <Container fluid className="section-container">
        <SuperconHeader params={params} superconData={supercon} />

        <Row>
          <TitledColumn
            width={6}
            title=""
            titleStyle={{ marginTop: 0 }}
            condition={supercon != null}
          >
            <SuperconInfoBox superconData={supercon} style={{ marginTop: 0 }} />
          </TitledColumn>

          <TitledColumn
            width={6}
            title="Electronic band structure"
            loading={bandsLoading}
            condition={bandsDataArray.length > 0}
            titleStyle={{ marginTop: 0 }}
          >
            <div style={{ marginBottom: 10, marginLeft: 10 }}>
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
          </TitledColumn>
        </Row>

        <Row>
          <TitledColumn
            width={12}
            title="Phonon bands and electron-phonon interaction"
            loading={bandsLoading}
            condition={
              phononBandsArray.length > 0 &&
              supercon.highest_phonon_frequency != null
            }
          >
            <div style={{ marginLeft: 10 }}>
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
                  dosData: { x: [0], y: [0] },
                  traceFormat: {
                    name: "",
                    legend: "legend2",
                    showlegend: false,
                    opacity: 0,
                  },
                },
              ]}
              loading={bandsLoading}
              layoutOverrides={SUPERCON_PHONON_A2F_LAYOUT_CONFIG}
              customTraces={getA2FTraces({
                a2f: a2fData?.a2f,
                frequency: a2fData?.frequency,
                degaussq: a2fData?.degaussq,
                lambda: a2fData?.lambda,
              })}
            />
          </TitledColumn>
        </Row>

        <Row>
          <TitledColumn
            width={9}
            title="Anisotropic superconducting gap function"
            condition={supercon.aniso_info != null}
            loading={gapfuncLoading}
          >
            <GapFunction
              gapfuncData={gapfuncData}
              verts={supercon.aniso_info?.temps}
              points={supercon.aniso_info?.average_deltas}
              delta0={supercon.aniso_info?.delta0}
              Tc={supercon.aniso_info?.Tc}
              expo={supercon.aniso_info?.expo}
              minXVal={0}
              maxXVal={null}
              minYVal={0}
              maxYVal={null}
            />
          </TitledColumn>
        </Row>
      </Container>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
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

// handler for fetching loading and setting of backend data.
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

function SuperConductivity({ params, loadedData }) {
  function safePrepareBands(bands, fermi, configName) {
    if (!bands || typeof fermi !== "number") return null;
    return prepareSuperConBand(bands, -fermi, configName);
  }

  const supercon = loadedData.details.supercon;
  console.log("Superconductivity Data:", supercon);

  // --- Return a empty div if data is missing --- //
  if (!supercon) return <div className="empty-supercon-div"></div>;

  // --- GapFunction Data ---
  const [gapfuncData, gapfuncLoading] = useAsyncData(
    () =>
      supercon.aniso_gap_function_uuid
        ? loadXY(`${params.method}-supercon`, supercon.aniso_gap_function_uuid)
        : null,
    [params.method, supercon.aniso_gap_function_uuid],
  );

  // --- A2F Data ---
  const [a2fData, a2fLoading] = useAsyncData(
    () =>
      supercon.a2f_uuid
        ? loadXY(`${params.method}-supercon`, supercon.a2f_uuid)
        : null,
    [params.method, supercon.a2f_uuid],
  );

  // --- Bands Data (both electronic + phonon) ---
  const [bandsResult, bandsLoading] = useAsyncData(async () => {
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

    // WARNING: EPW and QE bands are differently lengths.
    const rescaledFilteredBDArray = normalizeBandsData(
      [preppedQE, preppedEPW].filter(Boolean),
    );

    const preppedPh = safePrepareBands(phBands, 0, "phononEPW");

    console.log("Loaded bands:", { epwBands, qeBands, phBands });

    return {
      el: rescaledFilteredBDArray,
      ph: preppedPh ? [preppedPh] : [],
    };
  }, [params.method, supercon]);

  const bandsDataArray = bandsResult?.el ?? [];
  const phononBandsArray = bandsResult?.ph ?? [];

  return (
    <div>
      <Container fluid className="section-container">
        <SuperconHeader params={params} superconData={supercon} />
        {/* Electronic Bands + SuperCon Info */}
        <Row>
          <TitledColumn
            width={6}
            title=""
            titleStyle={{ marginTop: "0px" }}
            condition={supercon != null}
          >
            <SuperconInfoBox
              superconData={supercon}
              style={{ marginTop: "0px" }}
            />
          </TitledColumn>
          <TitledColumn
            width={6}
            title="Electronic band structure"
            loading={bandsLoading}
            condition={bandsDataArray?.length > 0}
            titleStyle={{ marginTop: "0px" }}
            fallback={
              <div className="text-gray-400 text-center">No bands data</div>
            }
          >
            <div style={{ marginBottom: "10px", marginLeft: "10px" }}>
              Electronic band structure calculated with Quantum ESPRESSO (QE)
              and the first-principles electron-phonon physics code EPW,
              computed via Wannier interpolation
            </div>
            <BandStructure
              bandsDataArray={bandsDataArray}
              loading={bandsLoading}
              minYval={-10.4}
              maxYval={+10.8}
              layoutOverrides={SUPERCON_BANDS_LAYOUT_CONFIG}
            />
          </TitledColumn>
        </Row>

        {/* Combined PhBands/Elaishberg plot */}
        <Row>
          <TitledColumn
            width={12}
            title="Phonon bands and electron-phonon interaction"
            loading={bandsLoading}
            condition={
              phononBandsArray.length > 0 &&
              supercon?.highest_phonon_frequency != null
            }
            fallback={
              <div className="text-gray-400 text-center mt-5">
                No bands data
              </div>
            }
          >
            <div style={{ marginLeft: "10px" }}>
              Phonon band structure calculated with EPW, Eliashberg spectral
              function [α<sup>2</sup>F(ω)] and electron-phonon coupling strength
              [λ(ω)].
            </div>
            <BandStructure // dodgy
              bandsDataArray={phononBandsArray}
              minYval={0}
              maxYval={
                supercon?.highest_phonon_frequency != null
                  ? Math.min(supercon?.highest_phonon_frequency + 2, 100)
                  : 100
              }
              dosDataArray={[
                {
                  dosData: {
                    x: [0],
                    y: [0],
                  },
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

        {/* Gap function plot */}
        <Row>
          <TitledColumn
            width={9}
            title="Anisotropic superconducting gap function"
            condition={supercon != null}
            loading={gapfuncLoading}
          >
            <GapFunction
              gapfuncData={gapfuncData}
              verts={supercon?.aniso_info?.temps}
              points={supercon?.aniso_info?.average_deltas}
              delta0={supercon?.aniso_info?.delta0}
              Tc={supercon?.aniso_info?.Tc}
              expo={supercon?.aniso_info?.expo}
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

export default SuperConductivity;

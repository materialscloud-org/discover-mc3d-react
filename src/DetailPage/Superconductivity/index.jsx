import { useState, useEffect, useMemo } from "react";

import "./index.css";

import { CalculationDetailsInfoBox, SuperconDetailsInfoBox } from "./InfoBoxes";

import { Container, Row, Col } from "react-bootstrap";

import { McloudSpinner } from "mc-react-library";

import {
  SUPERCON_BANDS_LAYOUT_CONFIG,
  SUPERCON_PHONON_A2F_LAYOUT_CONFIG,
} from "../../common/BandStructure/configs";

import {
  BandStructure,
  BandsA2F,
} from "../../common/BandStructure/BandStructure";

import {
  normalizeBandsData,
  prepareSuperConBand,
} from "../../common/BandStructure/bandUtils";

import GapFunction from "./GapFunction";

import { loadAiidaBands, loadXY } from "../../common/restApiUtils";
import { SuperconHeader } from "./Header";
import { getA2FTraces } from "./getA2FTraces";

function TitledColumn({
  width,
  subtitle,
  loading,
  condition,
  fallback,
  children,
  style = {},
  className = "",
  subtitleStyle = {},
  subtitleClassName = "",
}) {
  return (
    <Col md={width} className={`flex flex-col ${className}`} style={style}>
      {/* Subtitle always renders */}
      <div
        className={`subsection-title w-100 mb-1 ${subtitleClassName}`}
        style={{
          marginTop: "40px",
          marginBottom: "20px",
          ...subtitleStyle,
        }}
      >
        {subtitle || "\u00A0"}
      </div>

      {loading ? (
        <div className="flex justify-center items-center w-100 h-full">
          <div style={{ maxWidth: "70px", width: "100%" }}>
            <McloudSpinner />
          </div>
        </div>
      ) : condition ? (
        children
      ) : fallback ? (
        fallback
      ) : (
        <div></div>
      )}
    </Col>
  );
}

function SuperConductivity({ params, loadedData }) {
  function safePrepareBands(bands, fermi, configName) {
    if (!bands || typeof fermi !== "number") return null;
    return prepareSuperConBand(bands, -fermi, configName);
  }

  const supercon = loadedData.details.supercon;
  console.log("Supercon Data:", supercon);
  if (!supercon) return <div className="empty-supercon-div"></div>;

  // loading and data useStates
  const [bandsDataArray, setBandsDataArray] = useState([]);
  const [bandsLoading, setBandsLoading] = useState(false);

  const [phononBandsArray, setPhononBandsArray] = useState([]);
  const [phononBandsLoading, setPhononBandsLoading] = useState(false);

  const [a2fData, setA2fData] = useState(null);
  const [a2fLoading, setA2fLoading] = useState(false);

  const [gapfuncData, setGapfuncData] = useState(null);
  const [gapfuncLoading, setGapfuncLoading] = useState(false);

  // --- Fetch GapFunction Data ---
  useEffect(() => {
    async function fetchGapFunction() {
      if (!supercon.aniso_gap_function_uuid) {
        setGapfuncData(null);
        return;
      }

      setGapfuncLoading(true);
      try {
        const method = `${params.method}-supercon`;
        const data = await loadXY(method, supercon.aniso_gap_function_uuid);
        setGapfuncData(data || null);
        console.log("gp", gapfuncData);
      } catch (err) {
        setGapfuncData(null);
      } finally {
        setGapfuncLoading(false);
      }
    }
    fetchGapFunction();
  }, [params.method, supercon.aniso_gap_function_uuid]);

  // --- Fetch A2F Data ---
  useEffect(() => {
    async function fetchA2F() {
      if (!supercon.a2f_uuid) {
        setA2fData(null);
        return;
      }

      setA2fLoading(true);
      try {
        const method = `${params.method}-supercon`;
        const data = await loadXY(method, supercon.a2f_uuid);
        setA2fData(data || null);
      } catch (err) {
        setA2fData(null);
      } finally {
        setA2fLoading(false);
      }
    }
    fetchA2F();
  }, [params.method, supercon.a2f_uuid]);

  // --- Fetch Phonon Visualiser ---
  // useEffect(() => {
  //   if (!loadedData?.details?.id) return;

  //   async function fetchPhononVis() {
  //     setPhononVisLoading(true);
  //     try {
  //       const data = await loadSuperConPhononVis(loadedData.details.id);
  //       data.highsym_qpts?.forEach((qpt) => {
  //         qpt[1] = prettifyLabels(qpt[1]);
  //       });

  //       setPhononVisData(data);
  //     } catch (err) {
  //       console.error("Failed to load phonon visualiser:", err);
  //       setPhononVisData(null);
  //     } finally {
  //       setPhononVisLoading(false);
  //     }
  //   }
  //   fetchPhononVis();
  // }, [loadedData]);

  // --- Fetch Bands Data ---
  useEffect(() => {
    async function fetchBands() {
      setBandsLoading(true);
      setPhononBandsLoading(true);

      try {
        const method = `${params.method}-supercon`;

        const epwBands = supercon.epw_el_band_structure_uuid
          ? await loadAiidaBands(method, supercon.epw_el_band_structure_uuid)
          : null;

        const qeBands = supercon.qe_el_band_structure_uuid
          ? await loadAiidaBands(method, supercon.qe_el_band_structure_uuid)
          : null;

        const phBands = supercon.epw_ph_band_structure_uuid
          ? await loadAiidaBands(method, supercon.epw_ph_band_structure_uuid)
          : null;

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

        // WARNING BANDS DATA IS UNALIGNED WE NORMALISE IT HERE (DANGEROUSLY)
        const rescaledFilteredBDArray = normalizeBandsData(
          [preppedQE, preppedEPW].filter(Boolean),
        );

        const preppedPh = safePrepareBands(phBands, 0, "phononEPW");

        console.log("Loaded bands:", { epwBands, qeBands, phBands });

        setBandsDataArray(rescaledFilteredBDArray);
        setPhononBandsArray(preppedPh ? [preppedPh] : []);
      } catch (err) {
        setBandsDataArray([]);
        setPhononBandsArray([]);
      } finally {
        setBandsLoading(false);
        setPhononBandsLoading(false);
      }
    }
    fetchBands();
  }, [params.method, supercon]);

  return (
    <div>
      <Container fluid className="section-container">
        <SuperconHeader params={params} superconData={supercon} />
        {/* Electronic Bands + SuperCon Info */}
        <Row>
          <TitledColumn
            width={6}
            subtitle=""
            subtitleStyle={{ marginTop: "0px" }}
            condition={supercon != null}
          >
            <CalculationDetailsInfoBox
              superconData={supercon}
              style={{ marginTop: "0px" }}
            />
          </TitledColumn>
          <TitledColumn
            width={6}
            subtitle="Electronic Bands"
            loading={bandsLoading}
            condition={bandsDataArray?.length > 0}
            subtitleStyle={{ marginTop: "0px" }}
            fallback={
              <div className="text-gray-400 text-center">No bands data</div>
            }
          >
            <div style={{ marginBottom: "10px", marginLeft: "10px" }}>
              Electronic bands calculated with Quantum ESPRESSO (QE) and the
              first-principles electron-phonon physics code EPW.
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
            width={12} // messy way to make title look pretty.
            subtitle="Phonon bands and electron-phonon interaction"
            loading={phononBandsLoading}
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
            <BandsA2F
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
              loading={phononBandsLoading}
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
          {/* <TitledColumn
            width={12}
            subtitle="Superconducting properties"
            condition={supercon != null}
            style={{ minHeight: "10px" }}
            subtitleStyle={{ marginTop: "0px" }}
          >
            <div style={{ marginLeft: "10px" }}>
              Final resulting superconducting properties and the anisotropic gap
              function plot.
            </div>{" "}
          </TitledColumn> */}
          <TitledColumn
            width={9}
            subtitle="Anisotropic superconducting gap function"
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

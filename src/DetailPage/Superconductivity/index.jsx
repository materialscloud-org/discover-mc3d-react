import { useState, useEffect, useMemo } from "react";

import "./index.css";

import A2FPlot from "./A2FPlot";

import { SuperConInfo } from "./SuperconInfo";

import { Container, Row, Col } from "react-bootstrap";

import { McloudSpinner } from "mc-react-library";

import {
  BandStructure,
  prepareSuperConBand,
} from "../../common/BandStructure/BandStructure";

import {
  normalizeBandsData,
  prettifyLabels,
} from "../../common/BandStructure/bandUtils";

import PhononVisualizer from "mc-react-phonon-visualizer";

import { EXPLORE_URLS } from "../../common/restApiUtils";

import GapPlot from "./SuperConGap";

import {
  loadAiidaBands,
  loadXY,
  loadSuperConPhononVis,
} from "../../common/restApiUtils";
import { SuperconHeader } from "./SuperconHeader";

function Section({ title, children }) {
  return (
    <Row className="mb-4 g-4 align-items-start">
      {title && <div className="subsection-title w-100 mb-0">{title}</div>}
      {children}
    </Row>
  );
}

function SectionColumn({
  width,
  subtitle,
  loading,
  condition,
  fallback,
  children,
}) {
  return (
    <Col
      md={width}
      className="flex flex-col"
      style={{ minHeight: "300px" }} // ensures vertical centering works
    >
      {/* Always render subtitle row, even if empty */}
      <div className="subsection-title w-100 mb-2">{subtitle || "\u00A0"}</div>

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
        <div className="flex items-center justify-center h-full text-gray-400 border border-dashed rounded p-3">
          No data
        </div>
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

  // loading and data useStates
  const [bandsDataArray, setBandsDataArray] = useState([]);
  const [bandsLoading, setBandsLoading] = useState(false);

  const [phononBandsArray, setPhononBandsArray] = useState([]);
  const [phononBandsLoading, setPhononBandsLoading] = useState(false);

  const [a2fData, setA2fData] = useState(null);
  const [a2fLoading, setA2fLoading] = useState(false);

  const [gapfuncData, setGapfuncData] = useState(null);
  const [gapfuncLoading, setGapfuncLoading] = useState(false);

  const [phononVisData, setPhononVisData] = useState(null);
  const [phononVisLoading, setPhononVisLoading] = useState(false);

  if (!supercon) return <div className="empty-supercon-div"></div>;

  // --- Fetch GapFunction Data ---
  useEffect(() => {
    async function fetchGapFunction() {
      if (!supercon.aniso_gap_function_uuid) {
        console.warn(
          "No gapfunction data available for UUID:",
          supercon.aniso_gap_function_uuid,
        );
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
        console.error("Failed to load gapfunction data:", err);
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
        console.warn("No A2F data available for UUID:", supercon.a2f_uuid);
        setA2fData(null);
        return;
      }

      setA2fLoading(true);
      try {
        const method = `${params.method}-supercon`;
        const data = await loadXY(method, supercon.a2f_uuid);
        setA2fData(data || null);
      } catch (err) {
        console.error("Failed to load A2F data:", err);
        setA2fData(null);
      } finally {
        setA2fLoading(false);
      }
    }
    fetchA2F();
  }, [params.method, supercon.a2f_uuid]);

  // --- Fetch Phonon Visualiser ---
  useEffect(() => {
    if (!loadedData?.details?.id) return;

    async function fetchPhononVis() {
      setPhononVisLoading(true);
      try {
        const data = await loadSuperConPhononVis(loadedData.details.id);
        data.highsym_qpts?.forEach((qpt) => {
          qpt[1] = prettifyLabels(qpt[1]);
        });

        setPhononVisData(data);
      } catch (err) {
        console.error("Failed to load phonon visualiser:", err);
        setPhononVisData(null);
      } finally {
        setPhononVisLoading(false);
      }
    }
    fetchPhononVis();
  }, [loadedData]);

  //
  const numBands = useMemo(() => {
    return phononVisData?.eigenvalues?.[0]?.length ?? 0;
  }, [phononVisData]);

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
        // const rescaledFilteredBDArray = normalizeBandsData(
        //   [preppedQE, preppedEPW].filter(Boolean),
        // );

        const rescaledFilteredBDArray = [preppedQE, preppedEPW].filter(Boolean);

        const preppedPh = safePrepareBands(phBands, 0, "phononEPW");

        console.log("Loaded bands:", { epwBands, qeBands, phBands });

        setBandsDataArray(rescaledFilteredBDArray);
        setPhononBandsArray(preppedPh ? [preppedPh] : []);
      } catch (err) {
        console.error("Failed to load bands:", err);
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
      <SuperconHeader params={params} superconData={supercon} />

      <Container fluid className="section-container">
        {/* Electronic Bands + SuperCon Info */}
        <Section>
          <SectionColumn
            width={6}
            subtitle="Electronic Bands"
            loading={bandsLoading}
            condition={bandsDataArray?.length > 0}
            fallback={
              <div className="text-gray-400 text-center">No bands data</div>
            }
          >
            <BandStructure
              bandsDataArray={bandsDataArray}
              loading={bandsLoading}
              config="supercon-bands-wannier"
            />
          </SectionColumn>

          <SectionColumn width={6} subtitle=" " condition={supercon != null}>
            <SuperConInfo superconData={supercon} />
          </SectionColumn>
        </Section>
        {/* Phonon Bands + Spectral Function */}
        <Section>
          <SectionColumn
            width={6}
            subtitle="Phonon Bands"
            loading={phononBandsLoading}
            condition={
              phononBandsArray.length > 0 &&
              supercon?.highest_phonon_frequency != null
            }
            fallback={
              <div className="text-gray-400 text-center">No bands data</div>
            }
          >
            <BandStructure
              bandsDataArray={phononBandsArray}
              loading={phononBandsLoading}
              config="supercon-phonon-wannier"
              maxYval={supercon.highest_phonon_frequency + 2}
              minYval={0}
            />
          </SectionColumn>

          <SectionColumn
            width={6}
            subtitle="Spectral Function"
            loading={a2fLoading}
            condition={a2fData?.a2f && a2fData?.frequency}
            fallback={
              <div className="text-gray-400 text-center">No spectral data</div>
            }
          >
            <A2FPlot
              a2f={a2fData?.a2f}
              frequency={a2fData?.frequency}
              degaussq={a2fData?.degaussq}
              lambda={a2fData?.lambda}
              maxYval={supercon.highest_phonon_frequency + 2}
            />
          </SectionColumn>
        </Section>

        {/* Interactive Phonon Visualiser */}
        {/* <Section title="Interactive Phonon Visualiser">
          <SectionColumn */}
        {/* width={12}
            loading={phononVisLoading}
            condition={phononVisData != null} */}
        {/* > */}
        {/* <PhononVisualizer props={{ title: "Phonon visualizer", ...phononVisData }} /> */}
        {/* </SectionColumn> */}
        {/* </Section> */}
        {/* Gap Function */}
        <SectionColumn
          subtitle="Gap Function Plot"
          width={12}
          loading={gapfuncLoading}
          condition={gapfuncData != null && supercon?.aniso_info != null}
          fallback={
            <div className="text-gray-400 text-center">
              No Gap Function Data
            </div>
          }
        >
          <GapPlot
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
        </SectionColumn>
      </Container>
    </div>
  );
}

export default SuperConductivity;

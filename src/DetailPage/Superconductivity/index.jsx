import { useState, useEffect } from "react";

import A2FPlot from "./A2FPlot";

import { SuperConInfo } from "./SuperconInfo";

import { Container, Row, Col } from "react-bootstrap";

import { McloudSpinner } from "mc-react-library";

import {
  BandStructure,
  prepareSuperConBand,
} from "../../common/BandStructure/BandStructure";

import { normalizeBandsData } from "../../common/BandStructure/bandUtils";

import PhononVisualizer from "mc-react-phonon-visualizer";

import { EXPLORE_URLS } from "../../common/restApiUtils";

import GapPlot from "./SuperConGap";

import {
  loadAiidaBands,
  loadXY,
  loadSuperConPhononVis,
} from "../../common/restApiUtils";
import { SuperconHeader } from "./SuperconHeader";

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

  // Rendered sections below. //
  const sections = [
    {
      title: "",
      columns: [
        {
          width: 6,
          subTitle: "Electronic Bands",
          showTitleOnFallback: true,
          render: () => (
            <BandStructure
              bandsDataArray={bandsDataArray}
              loading={bandsLoading}
              config="supercon-bands-wannier"
            />
          ),
          condition: bandsDataArray?.length > 0,
          loading: bandsLoading,
          fallback: () => (
            <div className="text-gray-400 text-center">No bands data</div>
          ),
        },
        {
          width: 6,
          render: () => <SuperConInfo superconData={supercon} />,
          condition: supercon != null,
          loading: false,
        },
      ],
    },
    {
      title: "",
      columns: [
        {
          width: 6,
          subTitle: "Phonon Bands",
          showTitleOnFallback: true,
          render: () => (
            <BandStructure
              bandsDataArray={phononBandsArray}
              loading={phononBandsLoading}
              config="supercon-phonon-wannier"
              maxYval={supercon.highest_phonon_frequency + 2}
              minYval={0}
            />
          ),
          condition:
            phononBandsArray.length > 0 &&
            supercon?.highest_phonon_frequency != null,
          loading: phononBandsLoading,
          fallback: () => (
            <div className="text-gray-400 text-center">No bands data</div>
          ),
        },
        {
          width: 6,
          subTitle: "Spectral Function",
          showTitleOnFallback: false,
          render: () => (
            <A2FPlot
              a2f={a2fData?.a2f}
              frequency={a2fData?.frequency}
              degaussq={a2fData?.degaussq}
              lambda={a2fData?.lambda}
              maxYval={supercon.highest_phonon_frequency + 2}
            />
          ),
          condition: a2fData?.a2f && a2fData?.frequency,
          loading: a2fLoading,
          fallback: () => (
            <div className="text-gray-400 text-center">No spectral data</div>
          ),
        },
      ],
    },
    {
      title: "Interactive Phonon Visualiser",
      showTitleOnFallback: false,
      columns: [
        {
          width: 12,
          render: () => (
            <PhononVisualizer
              props={{ title: "Phonon visualizer", ...phononVisData }}
            />
          ),
          condition: phononVisData != null,
          loading: phononVisLoading,
        },
      ],
    },
    {
      title: "Gap Function",
      showTitleOnFallback: false,
      columns: [
        {
          width: 12,
          render: () => (
            <GapPlot
              gapfuncData={gapfuncData}
              verts={supercon.aniso_info.temps}
              points={supercon.aniso_info.average_deltas}
              delta0={supercon.aniso_info.delta0}
              Tc={supercon.aniso_info.Tc}
              expo={supercon.aniso_info.expo}
            />
          ),
          condition: gapfuncData != null && supercon.aniso_info != null,
          loading: gapfuncLoading,
          fallback: () => (
            <div className="text-gray-400 text-center">
              No Gap Function Data
            </div>
          ),
        },
      ],
    },
  ];

  console.log("gp", gapfuncData);

  return (
    <div>
      <SuperconHeader params={params} superconData={supercon} />

      <Container fluid className="section-container">
        {sections.map((section, i) => {
          const hasAnyContent = section.columns.some(
            (col) => col.condition || col.loading,
          );

          return (
            <Row key={i} className="mb-4 g-4">
              {section.title && (
                <div className="subsection-title w-100 mb-0">
                  {section.title || "\u00A0"}
                </div>
              )}

              {section.columns.map((col, j) => {
                const showTitle =
                  col.subTitle && (col.condition || col.showTitleOnFallback);

                return (
                  <Col key={j} md={col.width} className="flex-column">
                    {showTitle && (
                      <div className="subsection-title w-100 mb-2">
                        {showTitle ? col.subTitle : "\u00A0"}
                      </div>
                    )}

                    {col.loading ? (
                      <div className="flex justify-center items-center w-100">
                        <div style={{ maxWidth: "70px", width: "100%" }}>
                          <McloudSpinner />
                        </div>
                      </div>
                    ) : col.condition ? (
                      col.render()
                    ) : col.fallback ? (
                      col.fallback()
                    ) : (
                      <div className="flex items-center justify-center h-100 text-gray-400 border border-dashed rounded p-3">
                        No data
                      </div>
                    )}
                  </Col>
                );
              })}
            </Row>
          );
        })}
      </Container>
    </div>
  );
}

// === RENDER ===

export default SuperConductivity;

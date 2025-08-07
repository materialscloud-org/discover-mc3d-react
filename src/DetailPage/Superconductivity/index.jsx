import { useState, useEffect } from "react";

import A2FPlot from "./A2FPlot";

import { Container, Row, Col } from "react-bootstrap";

import "./index.css";

import {
  BandStructure,
  prepareSuperConBands,
} from "../../common/BandStructure/BandStructure";

import { MCInfoBox } from "../../common/MCInfoBox";

import { DoiBadge, ExploreButton } from "mc-react-library";

import { loadAiidaBands, loadXY } from "../../common/restApiUtils";

import { Placeholder, Card } from "react-bootstrap";

function SquarePlaceholder({ text = "" }) {
  return (
    <Card style={{ width: "450px", height: "450px" }} className="text-center">
      <Placeholder as={Card.Body} animation="glow">
        <Placeholder xs={12} style={{ height: "80%" }} />
        <Card.Text className="mt-3">{text}</Card.Text>
      </Placeholder>
    </Card>
  );
}

// helper function to round a float from loadedData.
function safeRound(value, decimals = 3) {
  if (typeof value === "number" && !isNaN(value)) {
    return value.toFixed(decimals);
  }
  return "N/A";
}

function SuperConductivity({ params, loadedData }) {
  const supercon = loadedData.details.supercon;
  const [bandsDataArray, setBandsDataArray] = useState([]);
  const [phononBandsArray, setPhononBandsArray] = useState([]);
  const [a2fData, setA2fData] = useState(null);

  const [loading, setLoading] = useState(true);

  // just return empty div instantly if no data.
  if (!supercon) {
    return <div className="empty-supercon-div"></div>;
  }

  // key value mapping for table entries.
  const infoEntries = [
    {
      key: "Allen-Dynes Tc",
      value: `${safeRound(supercon.allen_dynes_tc)} K`,
    },
    {
      key: "Omega log",
      value: `${safeRound(supercon.omega_log)} meV`,
    },
    {
      key: "Lambda",
      value: `${safeRound(supercon.lambda)}`,
    },
    {
      key: "Isotropic Tc",
      value: `${safeRound(supercon.iso_tc)} K`,
    },
    { key: "Anisotropic Tc", value: `${safeRound(supercon.aniso_gap_0)} K` },
  ];

  const infoEntries2 = [
    {
      key: "Coarse Fermi Energy?",
      value: `${safeRound(supercon.fermi_energy_coarse)} eV`,
    },
    {
      key: "Highest Phonon Frequency?",
      value: `${safeRound(supercon.highest_phonon_frequency)} eV`,
    },

    { key: "a2f_uuid?", value: supercon.a2f_uuid },
    {
      key: "aniso_retrieved_uuid: Folder Data - needs Backend Formatting?",
      value: supercon.aniso_retrieved_uuid,
    },

    {
      key: "pw_retrieved_uuid: Folder Data - needs Backend Formatting?",
      value: supercon.pw_retrieved_uuid,
    },
  ];

  // a2f plotData
  useEffect(() => {
    async function fetchA2F() {
      setLoading(true);
      try {
        const method = `${params.method}-supercon`;

        const data = supercon.a2f_uuid
          ? await loadXY(method, supercon.a2f_uuid)
          : null;

        if (data) {
          setA2fData(data);
        } else {
          console.warn("No A2F data available for UUID:", supercon.a2f_uuid);
          setA2fData(null);
        }
      } catch (err) {
        console.error("Failed to load A2F data:", err);
        setA2fData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchA2F();
  }, [params.method, supercon.a2f_uuid]);

  // bands plotData
  useEffect(() => {
    async function fetchAndPrepBands() {
      setLoading(true);
      try {
        // we fetch supercon method here.
        const method = params.method + "-supercon";
        // Build promises only if the UUID exists
        const epwBandsPromise = supercon.epw_el_band_structure_uuid
          ? loadAiidaBands(method, supercon.epw_el_band_structure_uuid)
          : Promise.resolve(null);

        const qeBandsPromise = supercon.qe_el_band_structure_uuid
          ? loadAiidaBands(method, supercon.qe_el_band_structure_uuid)
          : Promise.resolve(null);

        const phBandsPromise = supercon.epw_ph_band_structure_uuid
          ? loadAiidaBands(method, supercon.epw_ph_band_structure_uuid)
          : Promise.resolve(null);

        const [epwBands, qeBands, phBands] = await Promise.all([
          epwBandsPromise,
          qeBandsPromise,
          phBandsPromise,
        ]);

        // Log loaded or missing data
        console.log("Loaded bands:", { epwBands, qeBands, phBands });

        // group raw data (skip nulls)
        const rawElectronicBands = [qeBands, epwBands].filter(Boolean);
        const rawPhononBands = [phBands].filter(Boolean);

        const electronicBandsArray = prepareSuperConBands(
          rawElectronicBands,
          true,
          -supercon.fermi_energy_coarse,
          "supercon-bands-wannier",
        );
        setBandsDataArray(electronicBandsArray);

        const phononBandsArray = prepareSuperConBands(
          rawPhononBands,
          true,
          0,
          "supercon-phonon-wannier",
        );
        setPhononBandsArray(phononBandsArray);
      } catch (err) {
        console.error("Failed to load bands:", err);
        setBandsDataArray([]);
        setPhononBandsArray([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAndPrepBands();
  }, [params.method, supercon]);

  // === RETURNS BELOW === //
  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <div>
      <div className="section-heading">Contribution: Superconductivity</div>
      <div style={{ padding: "20px 20px" }}>
        Superconduction properities have been been provided by $AUTHOR_CITE, for
        details on methodology see $HYPERLINK. If using any of the data in this
        section be sure to cite $CITATION.
        <DoiBadge doi_id="TEMP URL" />
      </div>

      <div
        className="alert alert-warning"
        style={{ margin: "20px 20px" }}
        role="alert"
      >
        The methodology for this section re-relaxes the structure under a
        differing pseudopotential. To see the relaxed structure of this section
        explore the provenance.
        <ExploreButton explore_url={"TEMP"} uuid="TEMP" />
      </div>
      <Container fluid className="section-container">
        <Row>
          <div className="subsection-title">Wannier vs DFT BandsData...</div>
          <Col className="flex-column">
            <BandStructure
              bandsDataArray={bandsDataArray}
              loading={loading}
              config={"supercon-bands-wannier"}
            />
          </Col>
          <Col>
            <MCInfoBox>
              <div>
                <b>Superconducting properties</b>
                <ul className="no-bullets">
                  {infoEntries.map((item, idx) => (
                    <li key={idx}>
                      {item.key}: {item.value}
                    </li>
                  ))}
                </ul>
                <b>Other</b>
                <ul className="no-bullets">
                  {infoEntries2.map((item, idx) => (
                    <li key={idx}>
                      {item.key}: {item.value}
                    </li>
                  ))}
                </ul>
              </div>
            </MCInfoBox>
          </Col>
        </Row>
        <Row>
          <div className="subsection-title">Wannier vs DFT BandsData...</div>
          <Col className="flex-column">
            <BandStructure
              bandsDataArray={phononBandsArray}
              loading={loading}
              config={"supercon-phonon-wannier"}
            />
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <div className="subsection-title">Spectral Function plot.</div>
          {a2fData &&
            a2fData.a2f &&
            a2fData.frequency &&
            a2fData.degaussq &&
            a2fData.lambda && (
              <Col>
                <A2FPlot
                  a2f={a2fData.a2f}
                  frequency={a2fData.frequency}
                  degaussq={a2fData.degaussq}
                  lambda={a2fData.lambda}
                />
              </Col>
            )}
        </Row>
      </Container>
    </div>
  );
}

export default SuperConductivity;

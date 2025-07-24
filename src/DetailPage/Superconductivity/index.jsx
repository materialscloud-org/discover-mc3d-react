import React, { useState, useEffect, useRef, useCallback } from "react";

import { Container, Row, Col } from "react-bootstrap";

import "./index.css";

import {
  BandStructure,
  prepareSuperConBands,
} from "../../common/BandStructure/BandStructure";

import { MCInfoBox } from "../../common/MCInfoBox";

import { DoiBadge, ExploreButton } from "mc-react-library";

import { loadAiidaBands } from "../../common/restApiUtils";

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

  const [loading, setLoading] = useState(true);

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

    { key: "a2f_uuid", value: supercon.a2f_uuid },
    { key: "aniso_retrieved_uuid", value: supercon.aniso_retrieved_uuid },

    { key: "pw_retrieved_uuid", value: supercon.pw_retrieved_uuid },

    {
      key: "Highest Phonon Frequency?",
      value: `${safeRound(supercon.highest_phonon_frequency)} eV`,
    },
  ];

  useEffect(() => {
    async function fetchAndPrepBands() {
      setLoading(true);
      try {
        const [epwBands, qeBands, phBands] = await Promise.all([
          loadAiidaBands(params.method, supercon.epw_el_band_structure_uuid),
          loadAiidaBands(params.method, supercon.qe_el_band_structure_uuid),
          loadAiidaBands(params.method, supercon.epw_ph_band_structure_uuid),
        ]);

        // array the raw data
        const rawElectronicBands = [qeBands, epwBands];
        const rawPhononBands = [phBands];

        // format and seteBands
        const electronicBandsArray = prepareSuperConBands(
          rawElectronicBands,
          true,
          -supercon.fermi_energy_coarse,
        );
        setBandsDataArray(electronicBandsArray);

        // format phonon bands array
        const phononBandsArray = prepareSuperConBands(
          rawPhononBands,
          true,
          -supercon.fermi_energy_coarse,
          "supercon-phonon-wannier",
        );
        setPhononBandsArray(phononBandsArray);

        // error handling and clean up.
      } catch (err) {
        console.error("Failed to load bands:", err);
        setElectronicBands([]);
        setPhononBands(null);
      } finally {
        setLoading(false);
      }
    }

    fetchAndPrepBands();
  }, [params.method, supercon]);

  // === RETURNS BELOW === //

  // if no supercon just return an empty div
  if (!supercon) {
    return <div className="empty-supercon-div"></div>;
  }

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <div>
      <div className="section-heading">Contribution: Superconductivity</div>
      <div class="alert alert-warning" role="alert">
        Superconduction properities have been been provided by $AUTHOR_CITE, for
        details on methodology see $HYPERLINK. If using any of the data in this
        section be sure to cite $CITATION.
        <DoiBadge doi_id="TEMP URL" />
      </div>
      <div class="alert alert-warning" role="alert">
        The methodology for this section re-relaxes the structure under a
        differing pseudopotential. To see the relaxed structure of this section
        explore the provinence.{" "}
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
          <Col>
            <div className="subsection-title">2x1 Phonon bands</div>
            <BandStructure
              bandsDataArray={phononBandsArray}
              loading={loading}
              config={"supercon-phonon-wannier"}
            />
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
}

export default SuperConductivity;

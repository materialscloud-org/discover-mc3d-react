import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FermiVisualiserReact from "./FermiSurface";
import DhvaPlot from "./DhvaPlot";

import { buildBandColorMap } from "./getColor";

import { McloudSpinner } from "mc-react-library";

import { WarningBoxOtherMethod } from "../../common/WarningBox";

import { loadXY } from "../../common/aiidaRestApiUtils";
import { loadDhva } from "../../common/MCrestApiUtils";

const fermiMethod = "pbesol-v1";

const S3_ROOT_URL =
  "https://rgw.cscs.ch/matcloud:mc-discover-mcxd-public/mc3d/pbesol-v1_fermisurf";

export default function ElectronicStructureSection({ params }) {
  const { id, method } = params;

  // Fermi surface states
  const [fermisurfaceData, setFermisurfaceData] = useState(null);
  const [fermiLoading, setFermiLoading] = useState(true);
  const [fermiError, setFermiError] = useState(null);

  // DHVA states
  const [dhvaData, setDhvaData] = useState(null);
  const [dhvaLoading, setDhvaLoading] = useState(true);
  const [dhvaError, setDhvaError] = useState(null);

  // Fetch Fermi surface data
  useEffect(() => {
    if (!id || !method) return;

    const fetchFermi = async () => {
      setFermiLoading(true);
      setFermiError(null);

      try {
        const response = await fetch(`${S3_ROOT_URL}/${id}.json`);
        if (!response.ok) throw new Error(`File not found: ${response.status}`);
        const json = await response.json();
        setFermisurfaceData(json);
      } catch (err) {
        console.error(err);
        setFermiError(err.message);
      } finally {
        setFermiLoading(false);
      }
    };

    fetchFermi();
  }, [id, method]);

  // Fetch DHVA data
  useEffect(() => {
    if (!id || !method) return;

    const fetchDhva = async () => {
      setDhvaLoading(true);
      setDhvaError(null);

      try {
        // 1. Load base DHVA metadata
        const baseData = await loadDhva("pbesol-v1", id);

        // 2. For each skeaf_workchain, fetch actual frequency arrays
        const enrichedWorkchains = await Promise.all(
          baseData.skeaf_workchains.map(async (wc) => {
            const enrichedBands = await Promise.all(
              wc.bands.map(async (band) => {
                const xyData = await loadXY(
                  "pbesol-v1-fermisurf",
                  band.frequency_arraydata_uuid,
                );
                return { ...band, xyData };
              }),
            );
            return { ...wc, bands: enrichedBands };
          }),
        );

        setDhvaData({ ...baseData, skeaf_workchains: enrichedWorkchains });
      } catch (err) {
        console.error(err);
        setDhvaError(err.message || "Failed to fetch DHVA data");
      } finally {
        setDhvaLoading(false);
      }
    };

    fetchDhva();
  }, [id, method]);

  // Combined loading and error state
  const loading = fermiLoading || dhvaLoading;
  const error = fermiError || dhvaError;

  // Compute shared color map once both datasets are loaded
  const bandColorMap = useMemo(() => {
    if (!dhvaData || !fermisurfaceData) return {};
    return buildBandColorMap(dhvaData, fermisurfaceData);
  }, [dhvaData, fermisurfaceData]);

  if (loading)
    return (
      <Row>
        <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
          <McloudSpinner />
        </div>
      </Row>
    );
  if (error) return <Row></Row>;

  return (
    <div>
      <div className="section-heading">Electronic structure</div>

      {method !== fermiMethod && (
        <WarningBoxOtherMethod method={fermiMethod} id={id} />
      )}

      <Container fluid className="section-container">
        <Row>
          {fermisurfaceData && (
            <Col md={5}>
              <FermiVisualiserReact
                data={fermisurfaceData}
                bandColorMap={bandColorMap}
              />
            </Col>
          )}
          {dhvaData && (
            <Col md={7}>
              <DhvaPlot
                datasets={[{ data: dhvaData, fermiShift: 0 }]}
                bandColorMap={bandColorMap}
              />
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

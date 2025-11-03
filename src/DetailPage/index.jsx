import { useState, useEffect } from "react";

import "./index.css";

import { useParams, useNavigate } from "react-router-dom";

import MaterialsCloudHeader from "mc-react-header";

import { McloudSpinner } from "mc-react-library";

import TitleAndLogo from "../common/TitleAndLogo";

import { formatTitle } from "../common/utils";

import { Container } from "react-bootstrap";

import {
  loadMetadata,
  loadDetails,
  loadAiidaAttributes,
  loadAiidaCif,
} from "../common/restApiUtils";

import OverviewSection from "./OverviewSection";
import StructureSection from "./StructureSection";
import ProvenanceSection from "./ProvenanceSection";
import XrdSection from "./XrdSection";
import VibrationalSection from "./VibrationalSection";
import SuperConductivity from "./Superconductivity";

// if fetching fails we use this.
import MissingDataWarning from "./MissingDataWarning";

// contributed sections

// import RelatedSection from "./RelatedSection";

async function fetchCompoundData(method, id) {
  try {
    const [metadata, details] = await Promise.all([
      loadMetadata(method, id),
      loadDetails(method, id),
    ]);

    const structureUuid = details?.general?.structure_uuid;
    if (!structureUuid) throw new Error("Missing structure UUID");

    const [aiidaAttributes, structureCif] = await Promise.all([
      loadAiidaAttributes(method, structureUuid),
      loadAiidaCif(method, structureUuid),
    ]);

    return {
      metadata,
      details,
      structureInfo: { aiidaAttributes, cif: structureCif },
      missingStructureWarning: null,
    };
  } catch {
    return {
      metadata: null,
      details: null,
      structureInfo: { aiidaAttributes: null, cif: null },
      missingStructureWarning: true,
    };
  }
}

function DetailPage() {
  const [loadedData, setLoadedData] = useState(null);

  const navigate = useNavigate();
  const params = useParams(); // Route parameters

  useEffect(() => {
    setLoadedData(null);
    fetchCompoundData(params.method, params.id).then((loadedData) => {
      console.log("Loaded general data", loadedData);
      setLoadedData(loadedData);
    });
  }, [params.id, params.method]);

  // While loading, show spinner
  if (loadedData === null) {
    return (
      <MaterialsCloudHeader
        activeSection={"discover"}
        breadcrumbsPath={[
          { name: "Discover", link: "https://www.materialscloud.org/discover" },
          {
            name: "Materials Cloud Three-Dimensional Structure Database",
            link: `${import.meta.env.BASE_URL}`,
          },
          { name: `${params.id}/${params.method}`, link: null },
        ]}
      >
        <Container fluid="xxl">
          <TitleAndLogo />
          <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
            <McloudSpinner />
          </div>
        </Container>
      </MaterialsCloudHeader>
    );
  }

  // if Data is missing we show the Error.
  if (loadedData?.missingStructureWarning) {
    return <MissingDataWarning params={params} navigate={navigate} />;
  }

  // Otherwise proceed as normal.
  const title = formatTitle(
    loadedData.details.general.formula,
    params.id,
    params.method,
  );

  return (
    <MaterialsCloudHeader
      activeSection={"discover"}
      breadcrumbsPath={[
        { name: "Discover", link: "https://www.materialscloud.org/discover" },
        {
          name: "Materials Cloud Three-Dimensional Structure Database",
          link: `${import.meta.env.BASE_URL}`,
        },
        { name: `${params.id}/${params.method}`, link: null },
      ]}
    >
      <Container fluid="xxl">
        <TitleAndLogo />
        <div className="detail-page-heading">{title}</div>
        <OverviewSection params={params} loadedData={loadedData} />
        <StructureSection params={params} loadedData={loadedData} />
        <ProvenanceSection params={params} loadedData={loadedData} />
        <XrdSection params={params} loadedData={loadedData} />
        <VibrationalSection params={params} loadedData={loadedData} />
        <SuperConductivity params={params} loadedData={loadedData} />
        {/* <RelatedSection /> */}
      </Container>
    </MaterialsCloudHeader>
  );
}

export default DetailPage;

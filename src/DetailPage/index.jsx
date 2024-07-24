import React, { useState, useEffect } from "react";

import "./index.css";

import { useParams, useNavigate } from "react-router-dom";

import MaterialsCloudHeader from "mc-react-header";

import { McloudSpinner } from "mc-react-library";

import TitleAndLogo from "../common/TitleAndLogo";

import { formatTitle } from "../common/utils";

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

// import RelatedSection from "./RelatedSection";

async function fetchCompoundData(method, id) {
  let metadata = await loadMetadata(method, id);
  let details = await loadDetails(method, id);

  let structureUuid = details.general.uuid_structure;

  // the aiida endpoint should probably be included in the metadata.
  let aiidaEndpoint = "https://aiida.materialscloud.org/mc3d/api/v4";

  let aiidaAttributes = await loadAiidaAttributes(aiidaEndpoint, structureUuid);
  let structureCif = await loadAiidaCif(aiidaEndpoint, structureUuid);

  return {
    metadata: metadata,
    details: details,
    structureInfo: { aiidaAttributes: aiidaAttributes, cif: structureCif },
    aiidaEndpoint: aiidaEndpoint,
  };
}

function DetailPage() {
  const [loadedData, setLoadedData] = useState(null);

  const navigate = useNavigate();
  const params = useParams(); // Route parameters

  useEffect(() => {
    setLoadedData(null);
    fetchCompoundData(params.method, params.id).then((loadedData) => {
      console.log(loadedData);
      setLoadedData(loadedData);
    });
  }, [params.id, params.method]); // <- call when route params change

  let breadcrumbTitle = `${params.id}/${params.method}`;
  let title = null;

  let loading = loadedData == null;
  if (!loading) {
    title = formatTitle(
      loadedData.details.general.formula,
      params.id,
      params.method,
    );
  }
  return (
    <MaterialsCloudHeader
      activeSection={"discover"}
      breadcrumbsPath={[
        { name: "Discover", link: "https://www.materialscloud.org/discover" },
        {
          name: "Materials Cloud three-dimensional crystals database",
          link: `${import.meta.env.BASE_URL}`,
        },
        { name: breadcrumbTitle, link: null },
      ]}
    >
      <div className="detail-page">
        <TitleAndLogo />
        {loading ? (
          <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
            <McloudSpinner />
          </div>
        ) : (
          <div className="detail-page-inner">
            <div className="detail-page-heading">{title}</div>
            <OverviewSection loadedData={loadedData} />
            <StructureSection loadedData={loadedData} />
            <ProvenanceSection loadedData={loadedData} />
            <XrdSection loadedData={loadedData} params={params} />
            {/* <RelatedSection /> */}
          </div>
        )}
      </div>
    </MaterialsCloudHeader>
  );
}

export default DetailPage;

import React, { useState, useEffect } from "react";

import "./index.css";

import { useParams, useNavigate } from "react-router-dom";

import MaterialsCloudHeader from "mc-react-header";

import { McloudSpinner } from "mc-react-library";

import TitleAndLogo from "../common/TitleAndLogo";

import { formatTitle } from "../common/utils";

import { Container, Row, Col, Tab } from "react-bootstrap";

import TableOfContents from "./TableOfContents";

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

  let structureUuid = details.general.structure_uuid;

  let aiidaAttributes = await loadAiidaAttributes(method, structureUuid);
  let structureCif = await loadAiidaCif(method, structureUuid);

  return {
    metadata: metadata,
    details: details,
    structureInfo: { aiidaAttributes: aiidaAttributes, cif: structureCif },
  };
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
          name: "Materials Cloud Three-Dimensional Structure Database",
          link: `${import.meta.env.BASE_URL}`,
        },
        { name: breadcrumbTitle, link: null },
      ]}
    >
      <Row>
        <Col lg={2} className="d-none d-lg-flex justify-content-center">
          <div className="toc-sticky-container">
            <TableOfContents loadedData={loadedData} />
          </div>
        </Col>

        <Col lg={8}>
          <TitleAndLogo />
          {loading ? (
            <div style={{ width: "175px", padding: "40px", margin: "0 auto" }}>
              <McloudSpinner />
            </div>
          ) : (
            <>
              <div className="detail-page-heading">{title}</div>
              <OverviewSection params={params} loadedData={loadedData} />
              <StructureSection params={params} loadedData={loadedData} />
              <ProvenanceSection params={params} loadedData={loadedData} />
              <XrdSection params={params} loadedData={loadedData} />
              {/* <RelatedSection /> */}
            </>
          )}
        </Col>
        <Col lg={2} className="d-none d-lg-flex justify-content-end"></Col>
      </Row>
    </MaterialsCloudHeader>
  );
}

export default DetailPage;

import { useState, useEffect, lazy, Suspense } from "react";

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
  loadDatasetIndex,
  loadSuperConDetails,
  loadSuperConPhononVis,
} from "../common/MCrestApiUtils";

import { loadAiidaAttributes, loadAiidaCif } from "../common/AIIDArestApiUtils";

import AlternativeMethodsList from "./AlternativeMethodsList";
import buildAltMethodList from "../common/buildAltMethod";

import OverviewSection from "./OverviewSection";
import StructureSection from "./StructureSection";
import ProvenanceSection from "./ProvenanceSection";
import XrdSection from "./XrdSection";

// import VibrationalSection from "./VibrationalSection";
// import SuperConductivity from "./Superconductivity";
// lazy load the sections that may not exist.
const VibrationalSection = lazy(() => import("./VibrationalSection"));
const SuperconductivitySection = lazy(
  () => import("./SuperconductivitySection"),
);

// if fetching fails we use this.
import MissingDataWarning from "./MissingDataWarning";
import { CitationsList } from "../common/CitationsList";

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

async function fetchCompoundDataOther(method, id) {
  try {
    const [scDetails, scPhonons] = await Promise.all([
      loadSuperConDetails(method, id),
      loadSuperConPhononVis(method, id),
    ]);

    return {
      scDetails: scDetails,
      scPhonon: scPhonons,
    };
  } catch {
    return {
      scDetails: null,
      scPhonon: null,
    };
  }
}

/* 
Hierachal order of rendering.
2. Prioritise current method then best method
// Current method BASE
// Current method XRD
// Current Method ALL OTHER
// PBESOL V2 -those that exist above
// PBESOL V1 -those that exist above

General [ ALWAYS EXISTS ]
Structural [ ALWAYS EXISTS ]
Provenence [ ALWAYS EXISTS]
XRD [ ALWAYS EXISTS ] 
Electronic Props [ NOT ALWAYS - SHOW CURRENT OR BEST+WARN]
  Band structures - subset in pbesol-v1 and another subset in pbesol-v2
  Soon to be  wannier orbitals - subset in pbesol-v1
  Soon to be Fermisurfaces - subset in pbesol-v1
Vibrational Props [ NOT ALWAYS - SHOW CURRENT OR BEST+WARN]
  Interactive phononvisualiser - tiny subset in pbesol-v1
  Static phonon calculations - maybe never?
  
SUPERCONDUCTING Props [ NOT ALWAYS - SHOW CURRENT OR BEST+WARN]
  QE vs EPW band structures
  phonon + a2f phonon dos
  superconducting gap function.
*/

function DetailPage() {
  const [loadedData, setLoadedData] = useState(null);
  const [otherData, setOtherData] = useState(null);

  const [datasetIndex, setDatasetIndex] = useState(null);

  const navigate = useNavigate();
  const params = useParams(); // Route parameters

  useEffect(() => {
    setDatasetIndex(null);
    loadDatasetIndex(params.method, params.id).then((lD) => {
      setDatasetIndex(lD.index);
      buildAltMethodList(lD.index, params.method);
    });
  }, [params.id, params.method]);

  useEffect(() => {
    setLoadedData(null);
    fetchCompoundData(params.method, params.id).then((loadedData) => {
      console.log("Loaded general data", loadedData);
      setLoadedData(loadedData);
    });
  }, [params.id, params.method]);

  useEffect(() => {
    setOtherData(null);
    fetchCompoundDataOther(params.method, params.id).then((otherData) => {
      console.log("Loaded Other data", otherData);
      setOtherData(otherData);
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

  console.log("dI", datasetIndex);

  return (
    <>
      <MaterialsCloudHeader
        activeSection={"discover"}
        breadcrumbsPath={[
          {
            name: "Discover",
            link: "https://www.materialscloud.org/discover",
          },
          {
            name: "Materials Cloud Three-Dimensional Structure Database",
            link: `${import.meta.env.BASE_URL}`,
          },
          { name: `${params.id}/${params.method}`, link: null },
        ]}
      />
      <Container fluid="xxl">
        <TitleAndLogo />

        <div className="detail-page-heading">{title}</div>

        <CitationsList citationLabels={["HuberMc3d25"]} />
        <div style={{ marginLeft: "16px" }}>
          <AlternativeMethodsList
            id={params.id}
            methods={datasetIndex}
            currentMethod={params.method}
          />
        </div>
        <OverviewSection
          params={params}
          loadedData={loadedData}
          headerStyle={{
            margin: "0px 0px 10px 0px",
            padding: "0px 0px 10px 0px",
          }}
        />
        <StructureSection params={params} loadedData={loadedData} />
        <ProvenanceSection params={params} loadedData={loadedData} />
        <XrdSection params={params} loadedData={loadedData} />

        {/* only try to load the following sections if you visit supercon */}
        {otherData?.scPhonon && (
          <Suspense
            fallback={
              <div
                style={{ width: "150px", padding: "40px", margin: "0 auto" }}
              >
                <McloudSpinner />
              </div>
            }
          >
            <VibrationalSection params={params} loadedData={loadedData} />
          </Suspense>
        )}

        {otherData?.scDetails && (
          <Suspense
            fallback={
              <div
                style={{ width: "150px", padding: "40px", margin: "0 auto" }}
              >
                <McloudSpinner />
              </div>
            }
          >
            <SuperconductivitySection
              params={params}
              loadedData={loadedData}
              superconData={otherData.scDetails}
            />
          </Suspense>
        )}

        {/* <RelatedSection /> */}
      </Container>
    </>
  );
}

export default DetailPage;

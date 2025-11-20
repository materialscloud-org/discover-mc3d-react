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
import buildResultsObject from "../common/buildResultsObject";

import OverviewSection from "./OverviewSection";
import StructureSection from "./StructureSection";
import ProvenanceSection from "./ProvenanceSection";
import XrdSection from "./XrdSection";

import VibrationalSection from "./VibrationalSection";
import SuperconductivitySection from "./SuperconductivitySection";

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

async function fetchSuperconSubset(method, id) {
  try {
    const [scDetails, scPhonons] = await Promise.all([
      loadSuperConDetails(method, id),
      loadSuperConPhononVis(method, id),
    ]);

    return {
      method: method,
      scDetails: scDetails,
      scPhonon: scPhonons,
    };
  } catch {
    return {
      method: method,
      scDetails: null,
      scPhonon: null,
    };
  }
}

function DetailPage() {
  const navigate = useNavigate();
  const params = useParams(); // Route parameters

  const [datasetIndex, setDatasetIndex] = useState(null);
  const [resultsObject, setResultsObject] = useState({});

  const [coreData, setCoreData] = useState(null);

  const [superconPhononData, setSuperconPhononData] = useState(null);

  const [superconSCData, setSuperconSCData] = useState();

  useEffect(() => {
    setDatasetIndex(null);
    loadDatasetIndex(params.method, params.id).then((lD) => {
      setDatasetIndex(lD.index);
      setResultsObject(buildResultsObject(lD.index, params.method));
    });
  }, [params.id, params.method]);

  useEffect(() => {
    if (!resultsObject) return;

    console.log(resultsObject);

    // check if the core props exist in the resultsObject...
    // if it doesnt something has gone very wrong.
    if (resultsObject.core_base !== params.method) {
      console.log("Something went very wrong.");
      return;
    }

    setCoreData(null);
    fetchCompoundData(params.method, params.id).then((data) => {
      setCoreData(data);
    });

    // Check if supercon entries exist in resultsObject
    // This should be extended to the other partial methods at somepoint.
    if (resultsObject.supercon_base) {
      fetchSuperconSubset(resultsObject.supercon_base, params.id).then((sc) => {
        setSuperconSCData(sc); // superconducting details
        setSuperconPhononData(sc); // phonon/vis data
      });
    }
  }, [resultsObject, params.id, params.method]);

  // While loading, show spinner
  if (coreData === null) {
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
  if (coreData?.missingStructureWarning) {
    return <MissingDataWarning params={params} navigate={navigate} />;
  }

  // Otherwise proceed as normal.
  const title = formatTitle(
    coreData.details.general.formula,
    params.id,
    params.method,
  );

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
          loadedData={coreData}
          headerStyle={{
            margin: "0px 0px 10px 0px",
            padding: "0px 0px 10px 0px",
          }}
        />
        <StructureSection params={params} loadedData={coreData} />
        <ProvenanceSection params={params} loadedData={coreData} />
        <XrdSection params={params} loadedData={coreData} />

        <VibrationalSection
          params={params}
          loadedData={coreData}
          phononData={superconPhononData}
        />

        <SuperconductivitySection
          params={params}
          loadedData={coreData}
          superconData={superconSCData}
        />
      </Container>
    </>
  );
}

export default DetailPage;

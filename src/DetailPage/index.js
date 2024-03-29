import React, { useState, useEffect } from "react";

import VisualizerAndInfoSection from "./VisualizerAndInfoSection";
import XrdSection from "./XrdSection";
import SelectionSection from "./SelectionSection";
import StructureSection from "./StructureSection";
import ProvenanceSection from "./ProvenanceSection";

import TitleAndLogo from "../common/TitleAndLogo";

import { useParams, useNavigate } from "react-router-dom";

import MaterialsCloudHeader from "mc-react-header";

import { formatTitle } from "../common/utils";

import {
  REST_API_COMPOUNDS,
  REST_API_METADATA,
  REST_API_AIIDA,
} from "../common/config";

import "./index.css";
import McloudSpinner from "../common/McloudSpinner";

async function fetchCompoundData(compound, id) {
  // 1. fetch the urls:
  // const responseUrls = await fetch(mcRestApiUrl);
  // const jsonUrls = await responseUrls.json();

  // const compoundsUrl = jsonUrls.data.compounds_url;
  // const aiidaRestEndpoint = jsonUrls.data.aiida_rest_endpoint;

  // 2. fetch the compound data from MC Rest API:
  const responseCompound = await fetch(`${REST_API_COMPOUNDS}/${compound}`);
  const jsonCompound = await responseCompound.json();

  const metadata_response = await fetch(REST_API_METADATA, { method: "get" });
  const metadata_json = await metadata_response.json();
  const metadata = metadata_json.data;

  // this returns a list of structures with the formula.
  //We need to find the correct one with the specified id
  const spacegroupsArr = jsonCompound.data.map(
    (stru) => stru.info.spacegroup_international
  );
  const idsArr = jsonCompound.data.map((stru) => stru.info.mc3d_id);

  const selectedCompoundInfo = jsonCompound.data[idsArr.indexOf(id)];
  const uuid = selectedCompoundInfo.uuid_structure;

  // 3. fetch the data from the AiiDA Rest API:
  const responseAiiDA = await fetch(
    `${REST_API_AIIDA}/nodes/${uuid}/contents/attributes`
  );
  const jsonAiiDA = await responseAiiDA.json();

  // 4. fetch the structure as a cif file from the AIIDA Rest API:
  const responseAiiDACif = await fetch(
    `${REST_API_AIIDA}/nodes/${uuid}/download?download_format=cif&download=false`
  );
  const jsonAiiDACif = await responseAiiDACif.json();

  let loadedData = {
    aiidaRestEndpoint: REST_API_AIIDA,
    compoundInfo: selectedCompoundInfo,
    aiidaAttributes: jsonAiiDA.data.attributes,
    sameFormulaStructures: { spacegrps: spacegroupsArr, ids: idsArr },
    cifText: jsonAiiDACif.data.download.data,
    metadata: metadata,
  };
  return loadedData;
}

function DetailPage() {
  const [aiidaRestEndpoint, setAiidaRestEndpoint] = useState(null);
  const [compoundInfo, setCompoundInfo] = useState(null);
  const [aiidaAttributes, setAiidaAttributes] = useState(null);
  const [sameFormulaStructures, setSameFormulaStructures] = useState(null);
  const [cifText, setCifText] = useState(null);
  const [metadata, setMetadata] = useState(null);

  // for routing
  const navigate = useNavigate();
  const params = useParams();

  //console.log("route params", params);

  // componentDidMount equivalent
  useEffect(() => {
    // Set state to null to show "loading" screen
    // while new parameters are loaded
    setAiidaRestEndpoint(null);
    setCompoundInfo(null);
    setAiidaAttributes(null);
    setSameFormulaStructures(null);
    setCifText(null);
    setMetadata(null);

    let compound = params["compound"];
    let id = params["id"] + "/" + params["functional"];

    fetchCompoundData(compound, id).then((loadedData) => {
      setAiidaRestEndpoint(loadedData.aiidaRestEndpoint);
      setCompoundInfo(loadedData.compoundInfo);
      setAiidaAttributes(loadedData.aiidaAttributes);
      setSameFormulaStructures(loadedData.sameFormulaStructures);
      setCifText(loadedData.cifText);
      setMetadata(loadedData.metadata);
    });
  }, [params.compound, params.id, params.functional]); // <- call when route params change

  let loading = compoundInfo == null;
  return (
    <MaterialsCloudHeader
      activeSection={"discover"}
      breadcrumbsPath={[
        { name: "Discover", link: "https://www.materialscloud.org/discover" },
        {
          name: "Materials Cloud three-dimensional crystals database",
          link: `${process.env.PUBLIC_URL}`,
        },
        { name: formatTitle(params), link: null },
      ]}
    >
      <div className="detail-page">
        <TitleAndLogo />
        <div className="detail-page-inner">
          <h3>{formatTitle(params)}</h3>
          {loading ? (
            <McloudSpinner />
          ) : (
            <>
              <SelectionSection
                sameFormulaStructures={sameFormulaStructures}
                currentStructure={params}
              />
              <VisualizerAndInfoSection
                cifText={cifText}
                compoundInfo={compoundInfo}
                metadata={metadata}
              />
              <StructureSection
                aiidaAttributes={aiidaAttributes}
                compoundInfo={compoundInfo}
              />
              <ProvenanceSection compoundInfo={compoundInfo} />
              {/* <XrdSection /> */}
            </>
          )}
        </div>
      </div>
    </MaterialsCloudHeader>
  );
}

export default DetailPage;

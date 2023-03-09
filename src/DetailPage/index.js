import React, { useState, useEffect } from "react";

import VisualizerAndInfoSection from "./VisualizerAndInfoSection";
import XrdSection from "./XrdSection";
import SelectionSection from "./SelectionSection";
import StructureSection from "./StructureSection";
import ProvenanceSection from "./ProvenanceSection";

import TitleAndLogo from "../common/TitleAndLogo";

import { useParams, useNavigate } from "react-router-dom";

import Spinner from "react-bootstrap/Spinner";

import MaterialsCloudHeader from "mc-react-header";

import { formatTitle } from "../common/utils";

import "./index.css";
import McloudSpinner from "../common/McloudSpinner";

const mcRestApiUrl =
  "https://dev-www.materialscloud.org/mcloud/api/v2/discover/mc3d/info";

async function fetchCompoundData(compound, id) {
  // 1. fetch the urls:
  const responseUrls = await fetch(mcRestApiUrl);
  const jsonUrls = await responseUrls.json();

  const compoundsUrl = jsonUrls.data.compounds_url;
  const aiidaRestEndpoint = jsonUrls.data.aiida_rest_endpoint;

  // 2. fetch the compound data from MC Rest API:
  const responseCompound = await fetch(`${compoundsUrl}/${compound}`);
  const jsonCompound = await responseCompound.json();

  // this returns a list of structures with the formula.
  //We need to find the correct one with the specified id
  const spacegroupsArr = jsonCompound.data[compound].map(
    (stru) => stru.info.spacegroup_international
  );
  const idsArr = jsonCompound.data[compound].map((stru) => stru.info.mc3d_id);

  const selectedCompoundInfo = jsonCompound.data[compound][idsArr.indexOf(id)];
  const uuid = selectedCompoundInfo.uuid_structure;

  // 3. fetch the data from the AiiDA Rest API:
  const responseAiiDA = await fetch(
    `${aiidaRestEndpoint}/nodes/${uuid}/contents/attributes`
  );
  const jsonAiiDA = await responseAiiDA.json();

  // 4. fetch the structure as a cif file from the AIIDA Rest API:
  const responseAiiDACif = await fetch(
    `${aiidaRestEndpoint}/nodes/${uuid}/download?download_format=cif&download=false`
  );
  const jsonAiiDACif = await responseAiiDACif.json();

  let loadedData = {
    aiidaRestEndpoint: aiidaRestEndpoint,
    compoundInfo: selectedCompoundInfo,
    aiidaAttributes: jsonAiiDA.data.attributes,
    sameFormulaStructures: { spacegrps: spacegroupsArr, ids: idsArr },
    cifText: jsonAiiDACif.data.download.data,
  };
  return loadedData;
}

function DetailPage() {
  const [aiidaRestEndpoint, setAiidaRestEndpoint] = useState(null);
  const [compoundInfo, setCompoundInfo] = useState(null);
  const [aiidaAttributes, setAiidaAttributes] = useState(null);
  const [sameFormulaStructures, setSameFormulaStructures] = useState(null);
  const [cifText, setCifText] = useState(null);

  // for routing
  const navigate = useNavigate();
  const params = useParams();

  console.log("route params", params);

  // componentDidMount equivalent
  useEffect(() => {
    // Set state to null to show "loading" screen
    // while new parameters are loaded
    setAiidaRestEndpoint(null);
    setCompoundInfo(null);
    setAiidaAttributes(null);
    setSameFormulaStructures(null);
    setCifText(null);

    let compound = params["compound"];
    let id = params["id"] + "/" + params["functional"];

    fetchCompoundData(compound, id).then((loadedData) => {
      setAiidaRestEndpoint(loadedData.aiidaRestEndpoint);
      setCompoundInfo(loadedData.compoundInfo);
      setAiidaAttributes(loadedData.aiidaAttributes);
      setSameFormulaStructures(loadedData.sameFormulaStructures);
      setCifText(loadedData.cifText);
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
              />
              <StructureSection
                aiidaAttributes={aiidaAttributes}
                compoundInfo={compoundInfo}
              />
              <ProvenanceSection
                aiidaRestEndpoint={aiidaRestEndpoint}
                uuid={compoundInfo.uuid_structure}
              />
              {/* <XrdSection /> */}
            </>
          )}
        </div>
      </div>
    </MaterialsCloudHeader>
  );
}

export default DetailPage;

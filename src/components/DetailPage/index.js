import React from "react";

import InfoSection from "./InfoSection";
import XrdSection from "./XrdSection";
import SelectionSection from "./SelectionSection";
import StructureSection from "./StructureSection";

import { useParams, useNavigate } from "react-router-dom";

import Spinner from "react-bootstrap/Spinner";

import MaterialsCloudHeader from "react-materialscloud-header";

import "./index.css";

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

  let loadedData = {
    compoundInfo: selectedCompoundInfo,
    aiidaAttributes: jsonAiiDA.data.attributes,
    sameFormulaStructures: { spacegrps: spacegroupsArr, ids: idsArr },
  };
  return loadedData;
}

function formatChemicalFormula(formula) {
  // split formula into array of elements and numbers
  let f_split = formula.split(/(\d+)/);
  return f_split.map((v, index) => {
    if (v.match(/\d+/)) {
      return <sub key={index}>{v}</sub>;
    }
    return v;
  });
}

function formatTitle(params) {
  return (
    <span>
      {formatChemicalFormula(params["compound"])} ({params["id"]}/
      {params["functional"]})
    </span>
  );
}

class DetailPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      compoundInfo: null,
      aiidaAttributes: null,
      sameFormulaStructures: null,
    };
    console.log(this.props.params);
  }

  componentDidMount() {
    let compound = this.props.params["compound"];
    let id = this.props.params["id"] + "/" + this.props.params["functional"];

    fetchCompoundData(compound, id).then((loadedData) => {
      this.setState({
        compoundInfo: loadedData.compoundInfo,
        aiidaAttributes: loadedData.aiidaAttributes,
        sameFormulaStructures: loadedData.sameFormulaStructures,
      });
    });
  }

  render() {
    let loading = this.state.compoundInfo == null;
    return (
      <MaterialsCloudHeader
        activeSection={"discover"}
        breadcrumbsPath={[
          { name: "Discover", link: "https://www.materialscloud.org/discover" },
          {
            name: "Materials Cloud three-dimensional crystals database",
            link: "https://www.materialscloud.org/discover/mc3d",
          },
          { name: formatTitle(this.props.params), link: null },
        ]}
      >
        <div className="detail-page">
          <h3>{formatTitle(this.props.params)}</h3>
          {loading ? (
            <Spinner
              style={{
                padding: "20px",
                margin: "100px",
                background: "transparent",
              }}
              animation="border"
              role="status"
              variant="primary"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <>
              <InfoSection compoundInfo={this.state.compoundInfo} />
              <StructureSection aiidaAttributes={this.state.aiidaAttributes} />
              {/* <XrdSection /> */}
              <SelectionSection />
            </>
          )}
        </div>
      </MaterialsCloudHeader>
    );
  }
}

/**
 * Helper function to use "useParams" and "useNavigate"
 * as they can't be called from class components
 */
function routerHelper(Component) {
  return (props) => (
    <Component {...props} params={useParams()} navigate={useNavigate()} />
  );
}

export default routerHelper(DetailPage);

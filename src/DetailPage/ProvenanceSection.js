import React, { useState, useEffect } from "react";

import "./ProvenanceSection.css";

import McloudSpinner from "../common/McloudSpinner";

import ExploreButton from "./components/ExploreButton";

function formatAiidaFullType(fullType) {
  let label = "";
  if (fullType.includes("WorkChainNode")) label += "Work chain - ";
  else if (fullType.includes("CalcFunctionNode"))
    label += "Calculation function - ";
  else if (fullType.includes("CalcJobNode")) label += "Calculation job - ";

  if (fullType.includes(":")) label += fullType.split(":").pop();
  else label += fullType.split(".").pop();

  return label;
}

async function fetchProvenanceData(uuid, aiidaRestEndpoint) {
  // fetch the data from the AiiDA Rest API:
  const response = await fetch(
    `${aiidaRestEndpoint}/nodes/${uuid}/links/outgoing`
  );
  const outgoingLinks = await response.json();

  return outgoingLinks;
}

function ProvenanceSection(props) {
  // const [outgoingLinks, setOutgoingLinks] = useState(null);

  // componentDidMount equivalent
  // useEffect(() => {
  //   setOutgoingLinks(null);
  //   fetchProvenanceData(props.uuid, props.aiidaRestEndpoint).then((loaded) => {
  //     // setTimeout(() => setOutgoingLinks(loaded), 2000); // add some delay to test loading
  //     setOutgoingLinks(loaded);
  //   });
  // }, []);

  //console.log(outgoingLinks);
  // let loading = outgoingLinks == null;

  //console.log(props.compoundInfo["provenance_links"]);
  return (
    <div className="provenance-section">
      <b>Provenance links</b>
      <div className="provenance-section-inner">
        <div>Related nodes in the provenance browser:</div>
        <ul>
          {props.compoundInfo["provenance_links"].map((e) => {
            return (
              <li key={e.uuid}>
                {e.label} <ExploreButton uuid={e.uuid} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default ProvenanceSection;

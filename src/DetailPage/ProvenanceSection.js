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
  const [outgoingLinks, setOutgoingLinks] = useState(null);

  // componentDidMount equivalent
  useEffect(() => {
    setOutgoingLinks(null);
    fetchProvenanceData(props.uuid, props.aiidaRestEndpoint).then((loaded) => {
      // setTimeout(() => setOutgoingLinks(loaded), 2000); // add some delay to test loading
      setOutgoingLinks(loaded);
    });
  }, []);

  console.log(outgoingLinks);
  let loading = outgoingLinks == null;
  return (
    <div className="provenance-section">
      <b>Provenance links</b>
      <div className="provenance-section-inner">
        {loading ? (
          <McloudSpinner />
        ) : (
          <>
            {/* <div>Calculation that created this structure: -</div> */}
            <div>Calculations using this structure:</div>
            <ul>
              {outgoingLinks.data.outgoing.map((elem, i) => {
                console.log(elem.full_type);
                return (
                  <li key={i}>
                    {formatAiidaFullType(elem.full_type)}{" "}
                    <ExploreButton uuid={elem.uuid} />
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default ProvenanceSection;

import { MC_REST_API_URL, AIIDA_API_URLS } from "../common/restApiUtils";

import "./restapi.css";

const INDEX_URL = `${MC_REST_API_URL}pbe-v1/entries`;
const SINGLE_ENTRY_URL = `${MC_REST_API_URL}pbe-v1/entries/mc3d-10`;

export const restapiText = (
  <div className="restapi-text-container">
    <p>
      This section contains an overview of our REST APIs to access the MC3D
      data.
    </p>
    <div className="restapi-h">1. Materials Cloud and AiiDA REST APIs</div>
    <div>
      The MC3D frontend is running on the following APIs:
      <ul>
        <li>
          Index of materials:{" "}
          <a href={INDEX_URL} target="_blank">
            {INDEX_URL}
          </a>
        </li>
        <li>
          Single entry data:{" "}
          <a href={SINGLE_ENTRY_URL} target="_blank">
            {SINGLE_ENTRY_URL}
          </a>
        </li>
        <li>
          AiiDA REST API for properties and provenance:{" "}
          <a href={AIIDA_API_URLS["pbe-v1"]} target="_blank">
            {AIIDA_API_URLS["pbe-v1"]}
          </a>
        </li>
      </ul>
    </div>
    <div className="restapi-h">2. OPTIMADE REST API</div>
    <div>
      The MC3D database can also be accessed via an API following the{" "}
      <a href="https://www.optimade.org/optimade" target="_blank">
        OPTIMADE specification
      </a>
      . This currently only includes the crystal structures and no properties or
      provenance information is provided. Relevant endpoints are
      <ul>
        <li>
          <a
            href="https://aiida.materialscloud.org/mc3d/optimade/v1/info"
            target="_blank"
          >
            https://aiida.materialscloud.org/mc3d/optimade/v1/info
          </a>
        </li>
        <li>
          <a
            href="https://aiida.materialscloud.org/mc3d/optimade/v1/structures"
            target="_blank"
          >
            https://aiida.materialscloud.org/mc3d/optimade/v1/structures
          </a>
        </li>
      </ul>
    </div>
  </div>
);

import { REST_API_COMPOUNDS, REST_API_AIIDA } from "../common/config";

import "./restapi.css";

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
          <a href={REST_API_COMPOUNDS} target="_blank">
            {REST_API_COMPOUNDS}
          </a>
        </li>
        <li>
          Single compound data:{" "}
          <a href={REST_API_COMPOUNDS + "/Ag20Gd8Mg6"} target="_blank">
            {REST_API_COMPOUNDS + "/Ag20Gd8Mg6"}
          </a>
        </li>
        <li>
          AiiDA REST API for properties and provenance:{" "}
          <a href={REST_API_AIIDA} target="_blank">
            {REST_API_AIIDA}
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

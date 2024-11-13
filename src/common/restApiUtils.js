// ------------------------------------------------------------------------------------------------
// REST API UTILITIES
// Define all functions for api calls here.

// By default, use development API URLS
let mcRestApiUrl = "https://dev-aiida.materialscloud.org/mc-rest-api/mc3d/";
let aiidaRestBaseUrl = "https://dev-aiida.materialscloud.org";
let exploreBaseUrl = "https://dev-www.materialscloud.org/explore/";

// Use production backend if specified
if (import.meta.env.VITE_PRODUCTION_BACKEND === "true") {
  mcRestApiUrl = "https://aiida.materialscloud.org/mc-rest-api/mc3d/";
  aiidaRestBaseUrl = "https://aiida.materialscloud.org";
  exploreBaseUrl = "https://www.materialscloud.org/explore/";
}

export const MC_REST_API_URL = mcRestApiUrl;
const AIIDA_REST_BASE_URL = aiidaRestBaseUrl;
const EXPLORE_BASE_URL = exploreBaseUrl;

export const AIIDA_API_URLS = {
  "pbe-v1": `${AIIDA_REST_BASE_URL}/mc3d/api/v4`,
  "pbesol-v1": `${AIIDA_REST_BASE_URL}/mc3d-pbesol-v1/api/v4`,
  "pbesol-v2": `${AIIDA_REST_BASE_URL}/mc3d-pbesol-v2/api/v4`,
};

export const EXPLORE_URLS = {
  "pbe-v1": `${EXPLORE_BASE_URL}/mc3d`,
  "pbesol-v1": `${EXPLORE_BASE_URL}/mc3d-pbesol-v1`,
  "pbesol-v2": `${EXPLORE_BASE_URL}/mc3d-pbesol-v2`,
};

// delay function for testing loading animations:
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loadIndex(method) {
  // await delay(2000);
  let endpoint = `${MC_REST_API_URL}/${method}/overview`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching index:", error);
  }
}

export async function loadMetadata(method) {
  let endpoint = `${MC_REST_API_URL}/${method}/meta`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }
}

export async function loadDetails(method, id) {
  let endpoint = `${MC_REST_API_URL}/${method}/base/${id}`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching details:", error);
  }
}

export async function loadAiidaAttributes(method, uuid) {
  let aiidaUrl = AIIDA_API_URLS[method];
  let endpoint = `${aiidaUrl}/nodes/${uuid}/contents/attributes`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json.data.attributes;
  } catch (error) {
    console.error("Error fetching AiiDA attributes:", error);
  }
}

export async function loadAiidaCif(method, uuid) {
  let aiidaUrl = AIIDA_API_URLS[method];
  let endpoint = `${aiidaUrl}/nodes/${uuid}/download?download_format=cif&download=false`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json.data.download.data;
  } catch (error) {
    console.error("Error fetching AiiDA cif:", error);
  }
}

export async function loadXrd(method, id) {
  // await delay(2000);
  let endpoint = `${MC_REST_API_URL}/${method}/xrd/${id}`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    if (!response.ok) {
      return null;
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching XRD:", error);
    return null;
  }
}

export async function loadStructureUuids(method) {
  let endpoint = `${MC_REST_API_URL}/${method}/structure-uuids`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    if (!response.ok) {
      return null;
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching structure-uuids:", error);
    return null;
  }
}

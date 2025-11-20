// ------------------------------------------------------------------------------------------------
// AIIDA REST API UTILITIES
// Define all functions for api calls here.

// By default, use development API URLS
let aiidaRestBaseUrl = "https://aiida.dev.materialscloud.org";
let exploreBaseUrl = "https://www.materialscloud.dev/explore/";

// Use production backend if specified
if (import.meta.env.VITE_PRODUCTION_BACKEND === "true") {
  aiidaRestBaseUrl = "https://aiida.materialscloud.org";
  exploreBaseUrl = "https://www.materialscloud.org/explore/";
}

const AIIDA_REST_BASE_URL = aiidaRestBaseUrl;
const EXPLORE_BASE_URL = exploreBaseUrl;

// if fetching fails we use this as an emergency.

export const AIIDA_API_URLS = {
  "pbe-v1": `${AIIDA_REST_BASE_URL}/mc3d-pbe-v1/api/v4`,
  "pbesol-v1": `${AIIDA_REST_BASE_URL}/mc3d-pbesol-v1/api/v4`,
  "pbesol-v2": `${AIIDA_REST_BASE_URL}/mc3d-pbesol-v2/api/v4`,
  "pbesol-v1-supercon": `${AIIDA_REST_BASE_URL}/mc3d-pbesol-v1-supercon/api/v4`,
};

export const EXPLORE_URLS = {
  "pbe-v1": `${EXPLORE_BASE_URL}/mc3d-pbe-v1`,
  "pbesol-v1": `${EXPLORE_BASE_URL}/mc3d-pbesol-v1`,
  "pbesol-v2": `${EXPLORE_BASE_URL}/mc3d-pbesol-v2`,
  "pbesol-v1-supercon": `${EXPLORE_BASE_URL}/mc3d-pbesol-v1-supercon/api/v4`,
};

// delay function for testing loading animations:
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

export async function loadAiidaBands(aiidaProfile, uuid) {
  // await delay(2000);
  let aiidaUrl = AIIDA_API_URLS[aiidaProfile];
  const endpoint = `${aiidaUrl}/nodes/${uuid}/download?download_format=json`;

  console.log("bands endpoint", endpoint);

  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching AiiDA bands:", error);
  }
}

export async function loadXY(aiidaProfile, uuid) {
  // await delay(2000);
  let aiidaUrl = AIIDA_API_URLS[aiidaProfile];
  const endpoint = `${aiidaUrl}/nodes/${uuid}/download?download_format=json`;

  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching AiiDA bands:", error);
  }
}

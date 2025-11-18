// ------------------------------------------------------------------------------------------------
// REST API UTILITIES
// Define all functions for api calls here.

// By default, use development API URLS
let mcRestApiUrl = "https://api.dev.materialscloud.org/";
let aiidaRestBaseUrl = "https://aiida.dev.materialscloud.org";
let exploreBaseUrl = "https://www.materialscloud.dev/explore/";

// Use production backend if specified
if (import.meta.env.VITE_PRODUCTION_BACKEND === "true") {
  mcRestApiUrl = "https://api.materialscloud.org/";
  aiidaRestBaseUrl = "https://aiida.materialscloud.org";
  exploreBaseUrl = "https://www.materialscloud.org/explore/";
}

export const MC_REST_API_URL_BASE = mcRestApiUrl;
export const MC_REST_API_URL = `${mcRestApiUrl}mc3d`;
const AIIDA_REST_BASE_URL = aiidaRestBaseUrl;
const EXPLORE_BASE_URL = exploreBaseUrl;

// if fetching fails we use this as an emergency.
const MC_REST_API_FALLBACK_URL = "https://api.dev.materialscloud.org/mc3d";

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

async function fetchWithFallback(primaryUrl, fallbackUrl, timeout = 2500) {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    let response = await fetch(primaryUrl, { signal });
    clearTimeout(timeoutId);

    if (!response.ok)
      throw new Error(`Primary fetch failed with status ${response.status}`);
    return await response.json();
  } catch (err) {
    if (!fallbackUrl) {
      console.error("Fetch failed:", err);
      return null;
    }

    console.warn("Primary fetch failed, trying fallback:", err);

    const fallbackController = new AbortController();
    const fallbackSignal = fallbackController.signal;
    const fallbackTimeoutId = setTimeout(
      () => fallbackController.abort(),
      timeout,
    );

    try {
      let response = await fetch(fallbackUrl, {
        signal: fallbackSignal,
      });
      clearTimeout(fallbackTimeoutId);

      if (!response.ok)
        throw new Error(`Fallback fetch failed with status ${response.status}`);
      return await response.json();
    } catch (fallbackErr) {
      console.error("Both fetch attempts failed:", fallbackErr);
      return null;
    }
  }
}

export async function loadIndex(method) {
  const primary = `${MC_REST_API_URL}/${method}/overview`;
  const fallback = `${MC_REST_API_FALLBACK_URL}/${method}/overview`;
  return fetchWithFallback(primary, fallback);
}

export async function loadMetadata(method) {
  const primary = `${MC_REST_API_URL}/${method}/meta`;
  const fallback = `${MC_REST_API_FALLBACK_URL}/${method}/meta`;
  return fetchWithFallback(primary, fallback);
}

export async function loadDetails(method, id) {
  const primary = `${MC_REST_API_URL}/${method}/core_base/${id}`;
  const fallback = `${MC_REST_API_FALLBACK_URL}/${method}/core_base/${id}`;
  return fetchWithFallback(primary, fallback);
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

export async function loadAiidaBands(aiidaProfile, uuid) {
  // await delay(2000);
  let aiidaUrl = AIIDA_API_URLS[aiidaProfile];
  const endpoint = `${aiidaUrl}/nodes/${uuid}/download?download_format=json`;

  console.log("abEndpoint", endpoint);

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

export async function loadXrd(method, id) {
  const primary = `${MC_REST_API_URL}/${method}/core_xrd/${id}`;
  const fallback = `${MC_REST_API_FALLBACK_URL}/${method}/core_xrd/${id}`;
  const result = await fetchWithFallback(primary, fallback);
  return result?.data ?? null;
}

export async function loadSuperConDetails(method, id) {
  const primary = `${MC_REST_API_URL}/${method}/supercon_base/${id}`;
  const fallback = `${MC_REST_API_FALLBACK_URL}/${method}/supercon_base/${id}`;
  return fetchWithFallback(primary, fallback);
}

export async function loadSuperConPhononVis(method, id) {
  const primary = `${MC_REST_API_URL}/${method}/supercon_phonon-vis/${id}`;
  const fallback = `${MC_REST_API_FALLBACK_URL}/${method}/supercon_phonon-vis/${id}`;
  return fetchWithFallback(primary, fallback);
}

export async function loadStructureUuids(method) {
  const primary = `${MC_REST_API_URL}/${method}/structure-uuids`;
  const fallback = `${MC_REST_API_FALLBACK_URL}/${method}/structure-uuids`;
  return fetchWithFallback(primary, fallback);
}

export async function loadGeneralInfo() {
  const primary = `${MC_REST_API_URL}/info`;
  const fallback = `${MC_REST_API_FALLBACK_URL}/info`;
  return fetchWithFallback(primary, fallback);
}

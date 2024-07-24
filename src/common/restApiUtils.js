// ------------------------------------------------------------------------------------------------
// REST API UTILITIES
// This module contains the rest api calls.
// Define the functions here and use them in the rest of the code.

const MC_REST_API_URL =
  "https://dev-aiida.materialscloud.org/mc-rest-api/mc3d/";

// delay function for testing loading animations:
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loadIndex(method) {
  let url = `${MC_REST_API_URL}/${method}/entries`;
  try {
    const response = await fetch(url, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching index:", error);
  }
}

export async function loadMetadata(method) {
  let url = `${MC_REST_API_URL}/${method}/meta`;
  try {
    const response = await fetch(url, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }
}

export async function loadDetails(method, id) {
  let url = `${MC_REST_API_URL}/${method}/entries/${id}`;
  try {
    const response = await fetch(url, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching details:", error);
  }
}

export async function loadAiidaAttributes(aiidaEndpoint, uuid) {
  let url = `${aiidaEndpoint}/nodes/${uuid}/contents/attributes`;
  try {
    const response = await fetch(url, { method: "get" });
    const json = await response.json();
    return json.data.attributes;
  } catch (error) {
    console.error("Error fetching AiiDA attributes:", error);
  }
}

export async function loadAiidaCif(aiidaEndpoint, uuid) {
  let url = `${aiidaEndpoint}/nodes/${uuid}/download?download_format=cif&download=false`;
  try {
    const response = await fetch(url, { method: "get" });
    const json = await response.json();
    return json.data.download.data;
  } catch (error) {
    console.error("Error fetching AiiDA cif:", error);
  }
}

export async function loadXrd(method, id) {
  // await delay(2000);
  let url = `${MC_REST_API_URL}/${method}/xrd/${id}`;
  try {
    const response = await fetch(url, { method: "get" });
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

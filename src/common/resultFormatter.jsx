import { ExploreButton } from "mc-react-library";
import { EXPLORE_URLS } from "./aiidaRestApiUtils";

// helper function to render data that may or may not be present in the dataabase.
// filters undefined and renders a fallback.
// can also accept a baseUrl and uuid to render an aiida icon
export default function formatIfExists({
  value,
  exploreBaseURL = EXPLORE_URLS["pbesol-v1-supercon"],
  uuid = null,
  decimals = 3,
  format = (v) => v,
  fallback = "N/A",
}) {
  let formatted;

  if (typeof value === "number" && !isNaN(value)) {
    formatted = format(Number(value.toFixed(decimals)));
  } else if (Array.isArray(value)) {
    formatted = format(value.join(" × "));
  } else if (value !== undefined && value !== null) {
    formatted = format(value);
  } else {
    return fallback;
  }

  return uuid ? (
    <>
      {formatted} <ExploreButton explore_url={exploreBaseURL} uuid={uuid} />
    </>
  ) : (
    formatted
  );
}

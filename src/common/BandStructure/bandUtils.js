import { splitBandsData } from "bands-visualiser";
import * as math from "mathjs";

// Check if electronic data contains bands
export function bandsExist(electronicData) {
  return (
    electronicData.bands_uuid != null &&
    electronicData.fermi_energy?.value != null &&
    electronicData.band_gap?.value != null
  );
}

// Compute the band energy shift so Fermi level aligns to 0
export function computeBandShift(electronicData) {
  if (!bandsExist(electronicData)) return 0.0;

  const fermi = math.max(electronicData.fermi_energy.value); // max for spin-polarized
  const gap = electronicData.band_gap.value;
  return -fermi - gap / 2;
}

// Shifts all band values by a given amount
export function shiftBands(bandsData, shift) {
  bandsData.paths.forEach((path) => {
    path.values.forEach((subpath) => {
      subpath.forEach((val, idx, arr) => {
        arr[idx] += shift;
      });
    });
  });
}

// Format band data into array with styling (handles spin cases)
export function formatBandsData(bands) {
  if (bands.paths[0].two_band_types) {
    const [downBands, upBands] = splitBandsData(bands, 2);
    return [
      {
        bandsData: downBands,
        traceFormat: {
          label: "Down Channel",
          hovertemplate:
            "<b>Down Spin</b>: %{y:.3f} eV<br>" + "<extra></extra>",
          showlegend: false,
          line: { color: "#5B4EB8", dash: "solid", width: 1.6 },
        },
      },
      {
        bandsData: upBands,
        traceFormat: {
          label: "Up Channel",
          hovertemplate: "<b>Up Spin</b>: %{y:.3f} eV<br>" + "<extra></extra>",
          showlegend: false,
          line: { color: "#5B4EB8", dash: "dashdot", width: 1.6 },
        },
      },
    ];
  }

  return [
    {
      bandsData: bands,
      traceFormat: {
        hovertemplate: "<b>Energy</b>: %{y:.3f} eV<br>" + "<extra></extra>",
        showlegend: false,
        line: { color: "#5B4EB8", dash: "solid", width: 1.6 },
      },
    },
  ];
}

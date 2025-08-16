import { splitBandsData } from "bands-visualiser";
import * as math from "mathjs";

export function prettifyLabels(label) {
  const greekMapping = {
    GAMMA: "Γ",
    DELTA: "Δ",
    SIGMA: "Σ",
    LAMBDA: "Λ",
  };
  Object.keys(greekMapping).forEach((symbol) => {
    const regex = new RegExp(symbol, "gi");
    label = label.replace(regex, greekMapping[symbol]);
  });

  label = label.replace(/\bG\b/g, "Γ");
  label = label.replace(/-/g, "—");
  const ssMapping = {
    0: "₀",
    1: "₁",
    2: "₂",
    3: "₃",
    4: "₄",
    5: "₅",
    6: "₆",
    7: "₇",
    8: "₈",
    9: "₉",
  };
  label = label.replace(/_(.)/g, (match, p1) => ssMapping[p1] || match);

  return label;
}

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

// stretches bandData arrays so that they share a global xMin and global xMax.
export function normalizeBandsData(bandsObjects) {
  // Step 1: compute cumulative length of each bands entry
  const cumulativeLengths = bandsObjects.map((bandObj) => {
    const paths = bandObj.bandsData?.paths;
    if (!paths) return 0;

    return paths.reduce((sum, path) => {
      if (!path.x || path.x.length === 0) return sum;
      return sum + (path.x[path.x.length - 1] - path.x[0]);
    }, 0);
  });

  // Step 2: find the maximum cumulative length
  const globalMaxLength = Math.max(...cumulativeLengths);

  // Step 3: scale each dataset to match globalMaxLength
  const newBandsObjects = bandsObjects.map((bandObj, idx) => {
    const paths = bandObj.bandsData?.paths;
    if (!paths) return bandObj;

    const localLength = cumulativeLengths[idx];
    if (localLength === 0) return bandObj;

    const scale = globalMaxLength / localLength;

    const newPaths = paths.map((path) => {
      if (!path.x || path.x.length === 0) return path;
      return {
        ...path,
        x: path.x.map((x) => x * scale),
      };
    });

    return {
      ...bandObj,
      bandsData: {
        ...bandObj.bandsData,
        paths: newPaths,
      },
    };
  });

  return newBandsObjects;
}

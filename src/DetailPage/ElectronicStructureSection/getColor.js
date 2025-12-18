// utils/bandColors.js
const PLOTLY_DEFAULT_COLORS = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

// builds a common color map to keep colors in order.
export function buildBandColorMap(dhvaData, fermiData) {
  const fallbackColor = (bandNumber) => {
    const GOLDEN_ANGLE = 137.508;
    const hue = (bandNumber * GOLDEN_ANGLE) % 360;
    return `hsl(${hue},42%,52%)`;
  };

  const dhvaBands =
    dhvaData?.skeaf_workchains?.flatMap((wc) =>
      wc.bands.map((b) => b.band_number),
    ) ?? [];

  const fermiBands =
    fermiData?.scalarFields?.map((sf) =>
      parseInt(sf.name.replace("Band ", "")),
    ) ?? [];

  const allBands = [...new Set([...dhvaBands, ...fermiBands])].sort(
    (a, b) => a - b,
  );

  const map = {};
  allBands.forEach((bandNumber, i) => {
    map[bandNumber] =
      i < PLOTLY_DEFAULT_COLORS.length
        ? PLOTLY_DEFAULT_COLORS[i]
        : fallbackColor(bandNumber);
  });

  return map;
}

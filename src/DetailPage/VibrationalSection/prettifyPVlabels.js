export default function prettifyLabels(label) {
  // If it's an array, recursively prettify all string elements
  if (Array.isArray(label)) {
    return label.map((item) =>
      typeof item === "string" ? prettifyLabels(item) : item,
    );
  }

  if (typeof label !== "string") return label;

  const greekMapping = {
    GAMMA: "Γ",
    DELTA: "Δ",
    SIGMA: "Σ",
    LAMBDA: "Λ",
  };

  // Replace named Greek letters
  Object.entries(greekMapping).forEach(([key, symbol]) => {
    const regex = new RegExp(key, "gi");
    label = label.replace(regex, symbol);
  });

  // Replace standalone G with Γ
  label = label.replace(/\bG\b/g, "Γ");

  // Replace hyphens with em dashes
  label = label.replace(/-/g, "—");

  // Replace _0–_9 with subscript numerals
  const subscriptMap = {
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
  label = label.replace(/_(\d)/g, (_, d) => subscriptMap[d] || `_` + d);

  return label;
}

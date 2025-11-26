export default function buildResultsObject(methods, currentMethod) {
  if (!methods || !currentMethod) return {};

  // Best method hierarchy
  const methodHierarchy = [currentMethod, "pbesol-v2", "pbesol-v1", "pbe-v1"];

  // Entry hierarchy (controls output order)
  const entryHierarchy = [
    "core_base",
    "core_xrd",
    "electronic",
    "vibrational",
    "supercon_phonon-vis",
    "supercon_base",
  ];

  // Excluded entries per method
  const exclude = {
    "pbe-v1": ["example_base"],
  };

  const seenEntries = new Set();
  const result = {};

  // Loop over entries in hierarchy
  for (const entryName of entryHierarchy) {
    if (seenEntries.has(entryName)) continue;

    // Pick the first method in the method hierarchy that contains this entry
    for (const method of methodHierarchy) {
      const entries = methods[method] || [];
      const banned = exclude[method] || [];

      if (entries.includes(entryName) && !banned.includes(entryName)) {
        result[entryName] = method;
        seenEntries.add(entryName);
        break; // stop at the first method that has it
      }
    }
  }

  return result;
}

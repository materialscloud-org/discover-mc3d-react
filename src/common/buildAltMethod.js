export default function buildSections(methods, currentMethod) {
  if (!methods || !currentMethod) return {};

  // Define hierarchy, starting with the current method
  const hierarchy = [currentMethod, "pbesol-v2", "pbesol-v1", "pbe-v1"];

  const filteredMethods = {};
  const seenEntries = new Set();

  for (const method of hierarchy) {
    if (!methods[method]) continue;

    // Filter out entries already seen
    const uniqueEntries = methods[method].filter(
      (entry) => !seenEntries.has(entry),
    );

    // Add these entries to the seen set
    uniqueEntries.forEach((entry) => seenEntries.add(entry));

    if (uniqueEntries.length > 0) {
      filteredMethods[method] = uniqueEntries;
    }
  }

  return filteredMethods;
}

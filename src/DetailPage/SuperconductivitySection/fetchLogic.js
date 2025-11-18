import { useState, useEffect } from "react";
import { loadAiidaBands, loadXY } from "../../common/AIIDArestApiUtils";

import {
  normalizeBandsData,
  prepareSuperConBand,
} from "../../common/BandStructure/utils";

function safePrepareBands(bands, fermi, configName) {
  if (!bands || typeof fermi !== "number") return null;
  return prepareSuperConBand(bands, -fermi, configName);
}

// Generic async hook with cancellation
export function useAsyncEffect(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      try {
        const result = await fetcher();
        if (!cancelled) setData(result ?? null);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading };
}

// --- Fetchers for superconductivity data ---

export async function fetchBands(supercon, method) {
  console.log("supercon settings", supercon);
  const [epwBands, qeBands, phBands] = await Promise.all([
    supercon.epw_el_band_structure_uuid
      ? loadAiidaBands(
          `${method}-supercon`,
          supercon.epw_el_band_structure_uuid,
        )
      : null,
    supercon.qe_el_band_structure_uuid
      ? loadAiidaBands(`${method}-supercon`, supercon.qe_el_band_structure_uuid)
      : null,
    supercon.epw_ph_band_structure_uuid
      ? loadAiidaBands(
          `${method}-supercon`,
          supercon.epw_ph_band_structure_uuid,
        )
      : null,
  ]);

  const preppedEPW = safePrepareBands(
    epwBands,
    supercon.fermi_energy_coarse,
    "electronicEPW",
  );
  const preppedQE = safePrepareBands(
    qeBands,
    supercon.fermi_energy_coarse,
    "electronicQE",
  );
  const rescaledFilteredBDArray = normalizeBandsData(
    [preppedQE, preppedEPW].filter(Boolean),
  );
  const preppedPh = safePrepareBands(phBands, 0, "phononEPW");

  return { el: rescaledFilteredBDArray, ph: preppedPh ? [preppedPh] : [] };
}

export async function fetchGapFunc(supercon, method) {
  if (!supercon.aniso_gap_function_uuid) return null;
  return loadXY(`${method}-supercon`, supercon.aniso_gap_function_uuid);
}

export async function fetchA2F(supercon, method) {
  if (!supercon.a2f_uuid) return null;
  return loadXY(`${method}-supercon`, supercon.a2f_uuid);
}

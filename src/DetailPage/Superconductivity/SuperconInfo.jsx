import React, { useState, useEffect } from "react";

import { MCInfoBox } from "../../common/MCInfoBox";

// defining a nice formatted omegaLogLabel...
const omegaLogLabel = (
  <>
    ω<sub>log</sub>
    <span style={{ marginLeft: "0.10em" }}></span>
  </>
);

// helper function to round a float from loadedData.
function formatIfExists(
  value,
  { decimals = 3, format = (v) => v, fallback = undefined } = {},
) {
  if (typeof value === "number" && !isNaN(value)) {
    const rounded = Number(value.toFixed(decimals));
    return format(rounded);
  }
  return fallback;
}

export function SuperConInfo({ superconData }) {
  console.log("superconData", superconData);

  // key value mapping for table entries.
  const generalEntries = [
    {
      key: "Allen-Dynes Tc",
      value: formatIfExists(superconData.allen_dynes_tc, {
        format: (v) => `${v} K`,
        fallback: "Not calculated",
      }),
    },
    {
      key: omegaLogLabel,
      value: formatIfExists(superconData.omega_log, {
        format: (v) => `${v} meV`,
        fallback: "Not calculated",
      }),
    },
    {
      key: "λ",
      value: formatIfExists(superconData.lambda, {
        format: (v) => `${v}`,
        fallback: "Not calculated",
      }),
    },
    {
      key: "Coarse Fermi Energy",
      value: formatIfExists(superconData.fermi_energy_coarse, {
        format: (v) => `${v} eV`,
      }),
    },
    {
      key: "Highest Phonon Frequency",
      value: formatIfExists(superconData.highest_phonon_frequency, {
        format: (v) => `${v} meV`,
      }),
    },
  ].filter((entry) => entry.value !== undefined);

  const superConEntries = [
    {
      key: "Isotropic Tc",
      value: formatIfExists(superconData.iso_tc, {
        format: (v) => `${v} K`,
        fallback: "Not superconducting",
      }),
    },
    {
      key: "Anisotropic Tc",
      value: formatIfExists(superconData.aniso_info?.Tc, {
        format: (v) => `${v} K`,
        fallback: "Not superconducting",
      }),
    },
  ].filter((entry) => entry.value !== undefined);

  return (
    <MCInfoBox style={{ margin: "10px 0px 0px 0px" }}>
      <div>
        <b>General Properties</b>
        <ul className="no-bullets">
          {generalEntries
            .filter((item) => item.value !== undefined)
            .map((item, idx) => (
              <li key={idx}>
                {item.key}: {item.value}
              </li>
            ))}
        </ul>

        <b>Superconducting Properties</b>
        <ul className="no-bullets">
          {superConEntries
            .filter((item) => item.value !== undefined)
            .map((item, idx) => (
              <li key={idx}>
                {item.key}: {item.value}
              </li>
            ))}
        </ul>
      </div>
    </MCInfoBox>
  );
}

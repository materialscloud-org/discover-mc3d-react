import React, { useState, useEffect } from "react";

import { MCInfoBox } from "../../common/MCInfoBox";

// some symbols need a little space to look good.
const omegaLogLabel = (
  <>
    ω<sub>log</sub>
    <span style={{ marginLeft: "0.10em" }}></span>
  </>
);

const TcLabel = (
  <>
    T<sub>c</sub>
    <span style={{ marginLeft: "0.10em" }}></span>
  </>
);

// helper function to round a float from loadedData.
// we use undefined + .filter() to remove entries from an array
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
  const genInfo = [
    {
      key: "Space group number",
      value: formatIfExists(superconData.spacegroup, {
        format: (v) => `${v}`,
        fallback: "Unknown Spacegroup",
      }),
    },
    {
      key: "Total energy",
      value: formatIfExists(superconData.energy, {
        format: (v) => `${v} eV`,
        fallback: "Unknown Total energy",
      }),
    },
    {
      key: "Cell volume",
      value: formatIfExists(superconData.volume, {
        format: (v) => `${v} Å³`,
        fallback: "Unknown Spacegroup",
      }),
    },
    {
      key: "Fermi energy",
      value: formatIfExists(superconData.fermi_energy_coarse, {
        format: (v) => `${v} eV`,
      }),
    },
    {
      key: (
        <>
          ω<sup>max</sup>
        </>
      ),
      value: formatIfExists(superconData.highest_phonon_frequency, {
        format: (v) => `${v} meV`,
      }),
    },
  ];

  const superconInfo = [
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
      key: <>Allen-Dynes {TcLabel}</>,
      value: formatIfExists(superconData.allen_dynes_tc, {
        format: (v) => `${v} K`,
        fallback: "Not calculated",
      }),
    },
    {
      key: <>Isotropic {TcLabel}</>,
      value: formatIfExists(superconData.iso_tc, {
        format: (v) => `${v} K`,
        fallback: "Not superconducting",
      }),
    },
    {
      key: (
        <>
          Δ
          <sub>
            n<b>k</b>
          </sub>
          (0)
        </>
      ),
      value: formatIfExists(superconData.iso_tc, {
        format: (v) => `${v} K`,
        fallback: "Not superconducting",
      }),
    },
    {
      key: <>Anisotropic {TcLabel}</>,
      value: formatIfExists(superconData.aniso_info?.Tc, {
        format: (v) => `${v} K`,
        fallback: "Not superconducting",
      }),
    },
  ];

  const dftInfo = [
    {
      key: (
        <>
          E<sub>cut</sub>
        </>
      ),
      value: formatIfExists(superconData.energycutoff, {
        format: (v) => `${v} Ry`,
        fallback: "No data",
      }),
    },
    {
      key: "Smearing",
      value: formatIfExists(superconData.smearing, {
        format: (v) => `${v} eV`,
        fallback: "No data",
      }),
    },
    {
      key: "DFPT k-grid",
      value: "13×13×14",
    },
    {
      key: "DFPT q-grid",
      value: "4×4×4",
    },
  ];

  const epwInfo = [
    {
      key: "Type",
      value: formatIfExists(superconData.epw_type, {
        format: (v) => `${v}`,
        fallback: "No data",
      }),
    },
    {
      key: "Number of Wannier functions",
      value: formatIfExists(superconData.no_wannier, {
        format: (v) => `${v}`,
        fallback: "No data",
      }),
    },
    {
      key: "Coarse k-grid",
      value: "13×13×13",
    },
    {
      key: "Coarse q-grid",
      value: "4×4×4",
    },
    {
      key: "Fine k-grid",
      value: "23×23×23",
    },
    {
      key: "Fine q-grid",
      value: "4×4×4",
    },
    {
      key: "Smearing-q",
      value: formatIfExists(superconData.smearing_q, {
        format: (v) => `${v} meV`,
        fallback: "No data",
      }),
    },
    {
      key: "Fermi window",
      value: formatIfExists(superconData.fermi_window, {
        format: (v) => `${v} eV`,
        fallback: "No data",
      }),
    },
  ];

  return (
    <MCInfoBox style={{ margin: "10px 0px 0px 0px", height: "400px" }}>
      <div>
        <b>General Properties</b>
        <ul className="no-bullets">
          {genInfo
            .filter((item) => item.value !== undefined)
            .map((item, idx) => (
              <li key={idx}>
                {item.key}: {item.value}
              </li>
            ))}
        </ul>

        <b>Superconducting Properties</b>
        <ul className="no-bullets">
          {superconInfo
            .filter((item) => item.value !== undefined)
            .map((item, idx) => (
              <li key={idx}>
                {item.key}: {item.value}
              </li>
            ))}
        </ul>

        <b>DFT Info </b>
        <ul className="no-bullets">
          {dftInfo
            .filter((item) => item.value !== undefined)
            .map((item, idx) => (
              <li key={idx}>
                {item.key}: {item.value}
              </li>
            ))}
        </ul>

        <b>EPW Info</b>
        <ul className="no-bullets">
          {epwInfo
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

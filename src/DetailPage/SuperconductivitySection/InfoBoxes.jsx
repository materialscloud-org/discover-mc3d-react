import { TwoWideInfoBox } from "../../common/TwoWideInfoBox";
import { ExploreButton } from "mc-react-library";
import { EXPLORE_URLS } from "../../common/aiidaRestApiUtils";

import formatIfExists from "../../common/resultFormatter";

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
// we also use a hard coded defined base URL here.
// this is a messy pattern and should be fixed

export function SuperconInfoBox({ params, superconData, style = {} }) {
  const genInfo = [
    {
      key: "Space group number",
      value: formatIfExists({
        value: superconData.space_group_number,
        format: (v) => `${v}`,
      }),
    },
    {
      key: "Total energy",
      value: formatIfExists({
        value: superconData.total_energy,
        format: (v) => `${v} eV`,
      }),
    },
    {
      key: "Cell volume",
      value: formatIfExists({
        value: superconData.cell_volume,
        format: (v) => `${v} Å³`,
      }),
    },
    {
      key: "Fermi energy",
      value: formatIfExists({
        value: superconData.fermi_energy_coarse,
        format: (v) => `${v} eV`,
      }),
    },
    {
      key: (
        <>
          ω<sup>max</sup>
        </>
      ),
      value: formatIfExists({
        value: superconData.highest_phonon_frequency,
        uuid: superconData.uuid,
        format: (v) => `${v} meV`,
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
      value: formatIfExists({
        value: superconData.ecut,
        uuid: superconData.uuid,
        format: (v) => `${(v / 13.605703976).toFixed(0)} Ry`,
      }),
    },
    {
      key: "Smearing",
      value: formatIfExists({
        value: superconData.scf_smearing,
        uuid: superconData.uuid,
        format: (v) => `${v} eV`,
      }),
    },
    {
      key: (
        <>
          DFPT <b>k</b>-grid
        </>
      ),
      value: formatIfExists({
        value: superconData.kgrid_dfpt.mesh,
        uuid: superconData.kgrid_dfpt.uuid,
        format: (v) => (Array.isArray(v) ? v.join(" × ") : `${v}`),
      }),
    },
    {
      key: (
        <>
          DFPT <b>q</b>-grid
        </>
      ),
      value: formatIfExists({
        value: superconData.qgrid_epw_coarse.mesh,
        uuid: superconData.qgrid_epw_coarse.uuid,
        format: (v) => (Array.isArray(v) ? v.join(" × ") : `${v}`),
      }),
    },
  ];

  const epwInfo = [
    {
      key: "Type of anisotropy",
      value: formatIfExists({
        value: superconData.type,
        uuid: superconData.uuid,
        format: (v) => `${v}`,
      }),
    },
    {
      key: "Number of Wannier functions",
      value: formatIfExists({
        value: superconData.number_of_wannier_functions,
        format: (v) => `${v}`,
      }),
    },
    {
      key: (
        <>
          Coarse <b>k</b>-grid
        </>
      ),
      value: formatIfExists({
        value: superconData.kgrid_epw_coarse.mesh,
        uuid: superconData.kgrid_epw_coarse.uuid,
        format: (v) => (Array.isArray(v) ? v.join(" × ") : `${v}`),
      }),
    },
    {
      key: (
        <>
          Coarse <b>q</b>-grid
        </>
      ),
      value: formatIfExists({
        value: superconData.qgrid_epw_coarse.mesh,
        uuid: superconData.qgrid_epw_coarse.uuid,
        format: (v) => (Array.isArray(v) ? v.join(" × ") : `${v}`),
      }),
    },
    {
      key: (
        <>
          Fine <b>k</b>-grid
        </>
      ),
      value: formatIfExists({
        value: superconData.kgrid_epw_fine.mesh,
        uuid: superconData.kgrid_epw_fine.uuid,
        format: (v) => (Array.isArray(v) ? v.join(" × ") : `${v}`),
      }),
    },
    {
      key: (
        <>
          Fine <b>q</b>-grid
        </>
      ),
      value: formatIfExists({
        value: superconData.qgrid_epw_fine.mesh,
        uuid: superconData.qgrid_epw_fine.uuid,
        format: (v) => (Array.isArray(v) ? v.join(" × ") : `${v}`),
      }),
    },
    {
      key: "Smearing-q",
      value: formatIfExists({
        value: superconData.smearing_q,
        uuid: superconData.uuid,
        format: (v) => `${v} meV`,
      }),
    },
    {
      key: "Fermi window",
      value: formatIfExists({
        value: superconData.fermi_window,
        uuid: superconData.uuid,
        format: (v) => `±${v} eV`,
      }),
    },
  ];

  const superconInfo = [
    {
      key: omegaLogLabel,
      value: formatIfExists({
        value: superconData.omega_log,
        uuid: superconData.uuid,
        format: (v) => `${v} meV`,
      }),
    },
    {
      key: "λ",
      value: formatIfExists({
        value: superconData.lambda,
        uuid: superconData.uuid,
        format: (v) => `${v}`,
      }),
    },
    {
      key: <>Allen-Dynes {TcLabel}</>,
      value: formatIfExists({
        value: superconData.allen_dynes_tc,
        uuid: superconData.uuid,
        format: (v) => `${v} K`,
      }),
    },
    {
      key: <>Isotropic {TcLabel}</>,
      value: formatIfExists({
        value: superconData.iso_tc,
        uuid: superconData.uuid,
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
      value: formatIfExists({
        value: superconData.aniso_info?.delta0,
        uuid: superconData.uuid,
        format: (v) => `${v} K`,
      }),
    },
    {
      key: <>Anisotropic {TcLabel}</>,
      value: formatIfExists({
        value: superconData.aniso_info?.Tc,
        uuid: superconData.uuid,
        format: (v) => `${v} K`,
        fallback: "Not superconducting",
      }),
    },
  ];

  return (
    <TwoWideInfoBox
      {...{ style }}
      childrenLeft={
        <div>
          <b>General properties</b>
          <ul className="no-bullets">
            {genInfo
              .filter((item) => item.value !== undefined)
              .map((item, idx) => (
                <li key={idx}>
                  {item.key}: {item.value}
                </li>
              ))}
          </ul>
          <b>Superconducting properties</b>

          <ul className="no-bullets">
            {superconInfo
              .filter((item) => item.value !== undefined)
              .map((item, idx) => (
                <li key={idx}>
                  {item.key}: {item.value}
                </li>
              ))}
          </ul>
        </div>
      }
      childrenRight={
        <div>
          <b>
            DFT calculation details{" "}
            <ExploreButton
              explore_url={EXPLORE_URLS["pbesol-v1-supercon"]}
              uuid={superconData.pw_uuid}
            />
          </b>
          <ul className="no-bullets">
            {dftInfo
              .filter((item) => item.value !== undefined)
              .map((item, idx) => (
                <li key={idx}>
                  {item.key}: {item.value}
                </li>
              ))}
          </ul>
          <b>
            EPW calculation details{" "}
            <ExploreButton
              explore_url={EXPLORE_URLS["pbesol-v1-supercon"]}
              uuid={superconData.epw_uuid}
            />
          </b>
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
      }
    />
  );
}

export default SuperconInfoBox;

import { HashLink } from "react-router-hash-link";

import "./about.css";

// string keys stay in insertion order, so use this order to determine the citation number
const references = {
  mpds: {
    type: "db",
    ref: (
      <span>
        The Pauling File{" "}
        <a
          href="http://paulingfile.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          http://paulingfile.com/
        </a>{" "}
        exposed through the Materials Platform for Data Science{" "}
        <a href="https://mpds.io/" target="_blank" rel="noopener noreferrer">
          https://mpds.io/
        </a>
        .
      </span>
    ),
  },
  cod: {
    type: "db",
    ref: (
      <span>
        S. Gražulis et al. Crystallography open database (COD): an open-access
        collection of crystal structures and platform for world-wide
        collaboration. Nucleic Acids Research, 40:D420-D427, 2012,{" "}
        <a
          href="http://www.crystallography.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          http://www.crystallography.net
        </a>
        .
      </span>
    ),
  },
  icsd: {
    type: "db",
    ref: (
      <span>
        Inorganic Crystal Structure Database,{" "}
        <a
          href="http://www.fiz-karlsruhe.com/icsd.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          http://www.fiz-karlsruhe.com/icsd.html
        </a>
        .
      </span>
    ),
  },
  aiida1: {
    type: "software",
    ref: (
      <span>
        S. P. Huber et al. AiiDA 1.0, a scalable computational infrastructure
        for automated reproducible workflows and data provenance. Sci Data 7,
        300, 2020.{" "}
        <a
          href="http://www.aiida.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          http://www.aiida.net
        </a>
        .
      </span>
    ),
  },
  aiida2: {
    type: "software",
    ref: (
      <span>
        G. Pizzi et al. AiiDA: Automated Interactive Infrastructure and Database
        for Computational Science. Computational Materials Science, 111:218-230,
        2016.
      </span>
    ),
  },
  pymatgen: {
    type: "software",
    ref: (
      <span>
        S. P. Ong et al. Python materials genomics (pymatgen): A robust,
        open-source python library for materials analysis. Computational
        Materials Science, 68:314-319, 2013.
      </span>
    ),
  },
  spglib: {
    type: "software",
    ref: (
      <span>
        A. Togo. Spglib.{" "}
        <a
          href="https://spglib.readthedocs.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://spglib.readthedocs.io/
        </a>
        .
      </span>
    ),
  },
  qe: {
    type: "software",
    ref: (
      <span>
        P. Giannozzi et al. Advanced capabilities for materials modelling with
        Quantum ESPRESSO. Journal of Physics: Condensed Matter, 29:465901, 2017.
      </span>
    ),
  },
  sirius: {
    type: "software",
    ref: (
      <span>
        SIRIUS,{" "}
        <a
          href="https://github.com/electronic-structure/SIRIUS"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/electronic-structure/SIRIUS
        </a>
        .
      </span>
    ),
  },
  cod_parser: {
    type: "software",
    ref: (
      <span>
        A. Merkys et al. COD::CIF::Parser: an error-correcting CIF parser for
        the Perl language Journal of Applied Crystallography 49 (2016)
      </span>
    ),
  },
  sssp: {
    type: "pseudo_protocols",
    ref: (
      <span>
        G. Prandini, A. Marrazzo, I. E. Castelli, N. Mounet and N. Marzari, npj
        Computational Materials 4, 72 (2018).{" "}
        <a
          href="http://www.materialscloud.org/sssp/"
          target="_blank"
          rel="noopener noreferrer"
        >
          http://www.materialscloud.org/sssp/
        </a>
      </span>
    ),
  },
  sssp_protocols: {
    type: "pseudo_protocols",
    ref: (
      <span>
        SSSP protocol for the calculation of structural and thermodynamical
        properties of inorganic materials, Nicolas Hoermann et al., to be
        published.
      </span>
    ),
  },
};

function refNr(key) {
  return Object.keys(references).indexOf(key) + 1;
}

function getRef(key) {
  // the <a> ancor element doesn't work with react router, so use the HashLink instead
  return (
    <sup>
      <HashLink className="cite-anchor" to={"#ref" + refNr(key)}>
        [{refNr(key)}]
      </HashLink>
    </sup>
  );
}

function renderRefs(type) {
  return Object.keys(references).map((key) => {
    if (references[key]["type"] != type) return;
    let nr = refNr(key);
    return (
      <div id={"ref" + nr} key={nr}>
        [{nr}] {references[key]["ref"]}
      </div>
    );
  });
}

export const aboutText = (
  <div className="about-text-container">
    <p>
      This is a curated set of relaxed three-dimensional crystal structures
      based on raw CIF data taken from the external experimental databases MPDS
      {getRef("mpds")}, COD{getRef("cod")} and ICSD{getRef("icsd")}. The raw CIF
      data have been imported, cleaned{getRef("cod_parser")} and parsed
      {getRef("pymatgen")}
      {getRef("spglib")} into a crystal structure; their ground-state has been
      computed using the SIRIUS-enabled{getRef("sirius")} pw.x code of the
      Quantum ESPRESSO{getRef("qe")} distribution, and tight tolerance criteria
      for the calculations using the SSSP protocols{getRef("sssp")}
      {getRef("sssp_protocols")}.
    </p>
    <p>
      This entire procedure is encoded into an AiiDA{getRef("aiida1")}
      {getRef("aiida2")} workflow which automates the process while keeping full
      data provenance. Here, since the original source data of the ICSD and MPDS
      databases are copyrighted, only the provenance of the final SCF
      calculation on the relaxed structures can be made publicly available.
    </p>
    <p>
      The MC3D ID numbers come from a list of unique "parent" stoichiometric
      structures that has been created and curated from a collection of several
      experimental databases. Once a parent structure has been optimized using
      density-functional theory, it is made public and added to the online
      Discover section of the Materials Cloud (copyrights might prevent
      publishing the original parent). Note that since not all structures have
      been calculated, some ID numbers are missing from the public version of
      the database. The full ID of each structure also contains as an appended
      modifier the functional that was used in the calculations. Since the ID
      number points to the same unique parent, mc3d-1234/pbe and
      mc3d-1234/pbesol have the same starting point, but have been then relaxed
      according to their respective functionals.
    </p>
    <div className="about-h">Acknowledgements</div>
    <b>External databases of source CIF data</b>
    {renderRefs("db")}
    <b>Software</b>
    {renderRefs("software")}
    <b>Pseudopotentials and protocols</b>
    {renderRefs("pseudo_protocols")}
    <b>Funding partners</b>
    <br />
    This project is made possible by support from the European Centre of
    Excellence MaX “Materials design at the Exascale” (grant no. 824143), the
    Platform for Advanced Scientific Computing (PASC), and with HPC allocations
    from PRACE (project id 2020225458) and CSCS (project id s854).
  </div>
);

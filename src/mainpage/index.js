import React from "react";

import "./index.css";

import MaterialSelector from "mc-react-ptable-materials-grid";

import TitleAndLogo from "../common/TitleAndLogo";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

/* The MaterialsSelector needs two inputs:
 1) column definitions
 2) async function that loads data

 The data needs to be an array of row objects, whereas each row needs contain
 * entries for all the columns, with the key matching the 'field' string of the column.
 * 'elem_array', which is used in the periodic table filtering.
 */

/* Define the columns
 some columns are special: id, formula (see the implementation)
 * colType: "text", "integer", "float" - defines formatting & filters
 * hide: true if the column is hidden initially
 any additional input is passed to ag-grid column definitions (e.g. width) 
 */
const columns = [
  {
    field: "id",
    headerName: "ID",
    colType: "text",
  },
  {
    field: "formula",
    headerName: "Formula",
    colType: "text",
    width: 180,
  },
  {
    field: "n_elem",
    headerName: "Num. of elements",
    colType: "integer",
    hide: true,
  },
  {
    field: "spg_int",
    headerName: "Spacegroup int.",
    colType: "text",
  },
  {
    field: "spg_num",
    headerName: "Spacegroup nr.",
    colType: "integer",
  },
  {
    field: "tot_mag",
    headerName: "Total magn.",
    colType: "float",
  },
  {
    field: "abs_mag",
    headerName: "Abs. magn.",
    colType: "float",
  },
];

function calcElementArray(formula) {
  var formula_no_numbers = formula.replace(/[0-9]/g, "");
  var elements = formula_no_numbers.split(/(?=[A-Z])/);
  return elements;
}

function formatRows(compounds) {
  var rows = [];
  //var compounds = { Ag5O4Si: compounds_["Ag5O4Si"] };
  Object.keys(compounds).forEach((i) => {
    Object.keys(compounds[i]).forEach((j) => {
      var comp = compounds[i][j];
      var elemArr = calcElementArray(i);
      var row = {
        id: comp["id"],
        formula: i,
        spg_int: comp["spg"],
        spg_num: comp["spgn"],
        tot_mag: "tm" in comp ? comp["tm"] : null,
        abs_mag: "am" in comp ? comp["am"] : null,
        n_elem: elemArr.length,
        elem_array: elemArr,
        href: `${process.env.PUBLIC_URL}/#/details/${i}/${comp["id"]}`,
      };
      rows.push(row);
    });
  });
  return rows;
}

async function loadDataMc3d() {
  let compounds_url =
    "https://dev-www.materialscloud.org/mcloud/api/v2/discover/mc3d/compounds";

  const response = await fetch(compounds_url, { method: "get" });
  const json = await response.json();

  // return a Promise of the correctly formatted data
  return formatRows(json.data.compounds);
}

function MainPage() {
  return (
    <div className="main-page">
      <TitleAndLogo />
      <div className="description">
        Curated set of relaxed three-dimensional crystal structures based on raw
        CIF data from the experimental databases MPDS, COD, and ICSD.
      </div>
      <Tabs defaultActiveKey="use" className="mc3d-tabs">
        <Tab eventKey="use" title="Use">
          <div className="description">Search for materials:</div>
          <MaterialSelector columns={columns} loadData={loadDataMc3d} />
        </Tab>
        <Tab eventKey="about" title="About">
          <p>
            This is a curated set of relaxed three-dimensional crystal
            structures based on raw CIF data taken from the external
            experimental databases MPDS [1], COD [2] and ICSD [3]. The raw CIF
            data have been imported, cleaned [9] and parsed [5,6] into a crystal
            structure; their ground-state has been computed using the
            SIRIUS-enabled [8] pw.x code of the Quantum ESPRESSO [7]
            distribution, and tight tolerance criteria for the calculations
            using the SSSP protocols [10, 11].
          </p>
          <p>
            This entire procedure is encoded into an AiiDA [4] workflow which
            automates the process while keeping full data provenance. Here,
            since the original source data of the ICSD and MPDS databases are
            copyrighted, only the provenance of the final SCF calculation on the
            relaxed structures can be made publicly available.
          </p>
          <p>
            The MC3D ID numbers come from a list of unique "parent"
            stoichiometric structures that has been created and curated from a
            collection of several experimental databases. Once a parent
            structure has been optimized using density-functional theory, it is
            made public and added to the online Discover section of the
            Materials Cloud (copyrights might prevent publishing the original
            parent). Note that since not all structures have been calculated,
            some ID numbers are missing from the public version of the database.
            The full ID of each structure also contains as an appended modifier
            the functional that was used in the calculations. Since the ID
            number points to the same unique parent, mc3d-1234/pbe and
            mc3d-1234/pbesol have the same starting point, but have been then
            relaxed according to their respective functionals.
          </p>
          <b>External databases of source CIF data</b>
          <br />
          [1] S. Gražulis et al. Crystallography open database (COD): an
          open-access collection of crystal structures and platform for
          world-wide collaboration. Nucleic Acids Research, 40:D420-D427, 2012,
          http://www.crystallography.net.
          <br />
          [2] Inorganic Crystal Structure Database,
          http://www.fiz-karlsruhe.com/icsd.html.
          <br />
          [3] The Pauling File http://paulingfile.com/ exposed through the
          Materials Platform for Data Science https://mpds.io/.
          <br />
          <b>Software</b>
          <br />
          [4] G. Pizzi et al. AiiDA: Automated Interactive Infrastructure and
          Database for Computational Science. Computational Materials Science,
          111:218-230, 2016. http://www.aiida.net.
          <br />
          [5] S. P. Ong et al. Python materials genomics (pymatgen): A robust,
          open-source python library for materials analysis. Computational
          Materials Science, 68:314 - 319, 2013.
          <br />
          [6] A. Togo. Spglib. http://spglib.sourceforge.net.
          <br />
          [7] P. Giannozzi et al. Advanced capabilities for materials modelling
          with Quantum ESPRESSO. Journal of Physics: Condensed Matter,
          29:465901, 2017.
          <br />
          [8] SIRIUS, https://github.com/electronic-structure/SIRIUS.
          <br />
          [9] A. Merkys et al. COD::CIF::Parser: an error-correcting CIF parser
          for the Perl language Journal of Applied Crystallography 49 (2016)
          <br />
          <b>Pseudopotentials and protocols</b>
          <br />
          [10] G. Prandini, A. Marrazzo, I. E. Castelli, N. Mounet and N.
          Marzari, npj Computational Materials 4, 72 (2018).
          http://www.materialscloud.org/sssp/.
          <br />
          [11] SSSP protocol for the calculation of structural and
          thermodynamical properties of inorganic materials, Nicolas Hoermann et
          al., to be published.
          <br />
          <b>Funding partners</b>
          <br />
          This project is made possible by support from the European Centre of
          Excellence MaX “Materials design at the Exascale” (grant no. 824143),
          the Platform for Advanced Scientific Computing (PASC), and with HPC
          allocations from PRACE (project id 2020225458) and CSCS (project id
          s854).
        </Tab>
        <Tab eventKey="rest" title="REST API">
          <p>Description and usage of the REST API.</p>

          <p>
            Search data: <br />
            <a href="https://www.materialscloud.org/mcloud/api/v2/discover/mc3d/compounds">
              https://www.materialscloud.org/mcloud/api/v2/discover/mc3d/compounds
            </a>
            <br />
            Single compound data: <br />
            <a href="https://www.materialscloud.org/mcloud/api/v2/discover/mc3d/compounds/Ag10Gd4Mg3">
              https://www.materialscloud.org/mcloud/api/v2/discover/mc3d/compounds/Ag10Gd4Mg3
            </a>
            <br />
            AiiDA REST API endpoint: <br />
            <a href="https://aiida.materialscloud.org/mc3d/api/v4">
              https://aiida.materialscloud.org/mc3d/api/v4
            </a>
          </p>
        </Tab>
      </Tabs>
    </div>
  );
}

export default MainPage;

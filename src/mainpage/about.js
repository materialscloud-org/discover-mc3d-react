export const aboutText = (
  <div>
    <p>
      This is a curated set of relaxed three-dimensional crystal structures
      based on raw CIF data taken from the external experimental databases MPDS
      [1], COD [2] and ICSD [3]. The raw CIF data have been imported, cleaned
      [9] and parsed [5,6] into a crystal structure; their ground-state has been
      computed using the SIRIUS-enabled [8] pw.x code of the Quantum ESPRESSO
      [7] distribution, and tight tolerance criteria for the calculations using
      the SSSP protocols [10, 11].
    </p>
    <p>
      This entire procedure is encoded into an AiiDA [4] workflow which
      automates the process while keeping full data provenance. Here, since the
      original source data of the ICSD and MPDS databases are copyrighted, only
      the provenance of the final SCF calculation on the relaxed structures can
      be made publicly available.
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
    <b>External databases of source CIF data</b>
    <br />
    [1] S. Gražulis et al. Crystallography open database (COD): an open-access
    collection of crystal structures and platform for world-wide collaboration.
    Nucleic Acids Research, 40:D420-D427, 2012, http://www.crystallography.net.
    <br />
    [2] Inorganic Crystal Structure Database,
    http://www.fiz-karlsruhe.com/icsd.html.
    <br />
    [3] The Pauling File http://paulingfile.com/ exposed through the Materials
    Platform for Data Science https://mpds.io/.
    <br />
    <b>Software</b>
    <br />
    [4] G. Pizzi et al. AiiDA: Automated Interactive Infrastructure and Database
    for Computational Science. Computational Materials Science, 111:218-230,
    2016. http://www.aiida.net.
    <br />
    [5] S. P. Ong et al. Python materials genomics (pymatgen): A robust,
    open-source python library for materials analysis. Computational Materials
    Science, 68:314 - 319, 2013.
    <br />
    [6] A. Togo. Spglib. http://spglib.sourceforge.net.
    <br />
    [7] P. Giannozzi et al. Advanced capabilities for materials modelling with
    Quantum ESPRESSO. Journal of Physics: Condensed Matter, 29:465901, 2017.
    <br />
    [8] SIRIUS, https://github.com/electronic-structure/SIRIUS.
    <br />
    [9] A. Merkys et al. COD::CIF::Parser: an error-correcting CIF parser for
    the Perl language Journal of Applied Crystallography 49 (2016)
    <br />
    <b>Pseudopotentials and protocols</b>
    <br />
    [10] G. Prandini, A. Marrazzo, I. E. Castelli, N. Mounet and N. Marzari, npj
    Computational Materials 4, 72 (2018). http://www.materialscloud.org/sssp/.
    <br />
    [11] SSSP protocol for the calculation of structural and thermodynamical
    properties of inorganic materials, Nicolas Hoermann et al., to be published.
    <br />
    <b>Funding partners</b>
    <br />
    This project is made possible by support from the European Centre of
    Excellence MaX “Materials design at the Exascale” (grant no. 824143), the
    Platform for Advanced Scientific Computing (PASC), and with HPC allocations
    from PRACE (project id 2020225458) and CSCS (project id s854).
  </div>
);

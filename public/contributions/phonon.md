# Phonon calculations

### Motivation

Phonon dispersion is fundamental to understanding the physical properties of crystalline materials. They govern a wide range of phenomena, from thermal conductivity and heat capacity to thermal expansion and phase stability. A deep understanding of lattice dynamics is essential for predicting structural stability.

The Materials Cloud three-dimensional database (MC3D) provides a vast catalog of experimentally synthesised structures. Comprehensive data on their dynamical properties remains a critical frontier. By leveraging  density functional perturbation theory (DFPT), we can offer vital insights into their phase stability.

## supercond-QE database

This dataset builds upon the base dataset (PBEsol-v1) to provide a high-throughput computation of lattice dynamics in experimentally known inorganic stoichiometric compounds. Full details on the source methodology are available in the publication[^1]. Full details are available in the publication[^1].

The dynamical matrices were calculated for 4533 non-magnetic metals, utilizing a direct and progressively finer sampling of $\mathbf{q}$-points distances.

---

### Phonon calculation details

We collected 2825 dynamical matrices from successful subproces `PhBaseWorkChain` originating from a five-step workchain for electron-phonon coupling. 
Based on the dynamical matrices, we performed subsequent `Q2rBaseWorkChain` and `MatdynBaseWorkChain` interpolation independently for the visualized phonon dispersion using the "all" acoustic sum rull[^2](https://www.quantum-espresso.org/Doc/INPUT_MATDYN.html#id4). 
The pseudopotentials used here are from SSSP library[^3] with the planewave cutoff ($E_{\textrm{cut}}$) being the highest value recommended by the library.

In summary, the global workflow is:

1. compute ground state property via a scf calculation.
2. compute dynamical matrices via a phonon calculation.
3. compute interatomic force constants.
4. interpolate for visualized phonon dispersion.


---

Other details:

- Following convention $\omega^{\textrm{max}}$ refers to the maximum phonon frequency computed with density functional perturbation theory (DFPT).

---

### References and Further reading:

[^1]:
    _If using this work be sure to cite:_ Marnik Bercx, Samuel Poncé, Yiming Zhang. _et al._ Charting the landscape of Bardeen-Cooper-Schrieffer superconductors in experimentally known compounds. arXiv:2503.10943 (2025).  
    https://journals.aps.org/prxenergy/abstract/10.1103/sb28-fjc9

[^2]: _asr all:_ Lin, C., Poncé, S. & Marzari, N. General invariance and equilibrium conditions for lattice dynamics in 1D, 2D, and 3D materials. npj Comput Mater 8, 236 (2022). https://doi.org/10.1038/s41524-022-00920-6

[^3]: _SSSP Publication:_ Prandini, G., Marrazzo, A., Castelli, I.E. et al. Precision and efficiency in solid-state pseudopotential calculations. npj Comput Mater 4, 72 (2018). https://doi.org/10.1038/s41524-018-0127-2


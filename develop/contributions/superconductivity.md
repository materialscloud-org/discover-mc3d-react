## Superconductivity Dataset

This data set has been provided by external collaborators and therefore the methodology may slightly differ. Full details are availible in the publication[^1].

A high-throughput computational search for novel phonon-mediated superconductors, starting from the Materials Cloud 3-dimensional structure database of experimentally known inorganic stoichiometric compounds. The Allen-Dynes critical temperature ($T_{c}$) was calculated for 4533 non-magnetic metals using a direct and progressively finer sampling of the electron-phonon couplings. For the candidates with the largest $T_{c}$, A process of automated Wannierizations and electron-phonon interpolations was used to identify the most promising 250 dynamically stable structures. For these structures, spectral functions, superconducting bandgaps, and isotropic Migdal-Eliashberg critical temperatures were calculated.

### Motivation

Superconductors play an importantly role in many modern technologies, finding applications in magnetic resonance imaging, maglev trans and large-scale research infrastructure. While many superconductors have been discovered, high temperature superconductors remain elusive, often facing practical challenges such as synthetic difficulty or instability under ambient pressures.

The theoretical background for understanding high temperature superconductivity is still an active area of research and the importance on electron-phonon interactions cannot be understated. Since the materials cloud three-dimensional database (MC3D) provides over a large dataset of characterized it serves as a foundation for performaning high accuracy electron-phonon calculations on known materials.

---

### Superconductivity details

Many estimations of the $T_c$ for a material have been proposed. In this dataset three such estimations have been calculated.

Allen-Dynes $T_c$ refers to the superconducting transition temperature computed with the Allen-Dynes formula[^2]:

$$
k_B T_{c}^{\textrm{AD}} = \frac{\hbar \omega_{\textrm{log}}}{1.2} \exp \Big[ \frac{-1.04(1+\lambda)}{\lambda - \mu^*(1+0.62\lambda)}   \Big],
$$

- $\lambda$: electron-phonon coupling strength,
- $\omega_{\textrm{log}}$: logarithmic average of the phonon frequencies
- $\mu^*$: Coulomb screening parameter, chosen to be $\mu^*=0.13$ for all materials.

The Isotropic $T_c$ refers to the solution of the isotropic Migdal-Eliashberg superconducting transition temperature. _Eqs 29-34 in footnote publication[^3]_

Finally the Anisotropic $T_c$ refers to the solution of the anisotropic Migdal-Eliashberg superconducting transition temperature. _Eqs 20-28 in footnote publication.[^3]_

$\Delta_{n\mathbf{k}}(0)$ is the value of the superconducting gap (in meV), extrapolated at 0K. It is obtained from a fit of the anisotropic $T_c$ data with a BCS equation.

---

### DFT calculation details

Due to the high-throughput multistep process undertaken; The open-source workflow manager AiiDA was used.

The initial electron-phonon workchain is a five-step workflow that calculates the Eliashberg spectral function, The psuedopotentials used here are norm-conserving and from the standard solid-state pseudopotentials (SSSP) PBEsol efficiency v1.1[^4] library with the planewave cutoff ($E_{\textrm{cut}}$) being the highest value recommended by the library.

- a DFT calculation performed on a fine **k**-point grid that is used later
- a DFT calculation on a coarser grid required to calculate the phonons in the next step
- a phonon calculation which calculates the electron-phonon coefficients on the coarse **k**-grid with a commensurate **q**-grid
- calculations of the real-space force constants.
- the Fourier interpolation over a dense **q**-grid and to calculate the final electron-phonon coupling and corresponding spectral function on the fine **k**-point grid.

---

### EPW calculation details

For ensuring accurate phonon calculations on potential superconductors, both Quantum ESPRESSO and EPW was utilised. EPW is neccessary here as it specialises in computing electron-phonon interactions using maximally localized wannier functions. For the EPW pipeline the choice of pseudopotential was switched to those recommended by PSUEDODOJO v0.5[^5] as projector augmented wave psuedopotentials have not been extensively tested with the EPW code. This workflow has the following steps:

- construct wannier functions for the input structure using SCDM-k [^6]
- compute dynamical matrices and perturbed potentials via a phonon calculation.
- coarse grid EPW calculations to identify potential candidates.
- dense grid electron-phonon calculations in EPW on these candidates to calculate $T_c$
- full Eliashberg theory calculation across the dense grid to calculate the isotropic Eliashberg $T_c$

---

### Definitions, citations and further reading.

Two types of anisotropic calculation were performed:

- _"FBW" refers to the anisotropic full-bandwidth (FBW) Eliashberg equations. Eqs. 20-25 of the footnote publication [^3]._
- _"FSR" refers to the anisotropic Fermi surface restricted (FSR) Eliashberg equations. Eqs. 27-28 of the footnote publication [^3]._

for **k**/**q**-grids the following holds true:

- The coarse **k**-point grid used for the EPW calculation is not neccessarily the same as the DFPT **k**-grid.
- The coarse **q**-point grid used for the EPW calculation is always the same as DFPT **q**-grid.
- The fine **k**-point grid is obtained from Fourier/Wannier interpolation.
- The Fine **q**-grid is obtained from Fourier/Wannier interpolation.

Other details:

- The smearing value (_Smearing-q_) refers to the _"degaussq"_ input variable in EPW and is the smearing over q in the electron-phonon coupling in meV.
- The Fermi window refers to the states around the Fermi level included in the superconducting calculation, expressed in eV.
- Number of Wannier functions: Importantly, these are Wannier functions for states around the Fermi level and therefore states deep into the the valence or conduction band are sometimes not calculated.
- _Following convention $\omega^{\textrm{max}}$ refers to the maximum phonon frequency computed with density functional perturbation theory (DFPT)._

References and Further reading:

[^1]:
    _If using this work be sure to cite:_ Marnik Bercx, Samuel Poncé, Yiming Zhang. _et al._ Charting the landscape of Bardeen-Cooper-Schrieffer superconductors in experimentally known compounds. arXiv:2503.10943 (2025).  
    https://doi.org/10.48550/arXiv.2503.10943

[^2]:
    _For details on Allen-Dynes superconductivity:_ P.B. Allen, R.C. Dynes Transition temperature of strong-coupled superconductors reanalyzed. Phys. Rev. B 12, 905 – Published 1 August, 1975
    https://doi.org/10.1103/PhysRevB.12.905_

[^3]: _For details on isotropic Migdal-Eliashberg superconductivity:_ Lee, H., Poncé, S., Bushick, K. et al. Electron–phonon physics from first principles using the EPW code. npj Comput Mater 9, 156 (2023). https://doi.org/10.1038/s41524-023-01107-3

[^4]: _SSSP Publication:_ Prandini, G., Marrazzo, A., Castelli, I.E. et al. Precision and efficiency in solid-state pseudopotential calculations. npj Comput Mater 4, 72 (2018). https://doi.org/10.1038/s41524-018-0127-2

[^5]:
    _The PseudoDojo:_ Training and grading a 85 element optimized norm-conserving pseudopotential table
    M. J. van Setten, M. Giantomassi, E. Bousquet, M. J. Verstraete, D. R. Hamann, X. Gonze, G.-M. Rignanese
    Computer Physics Communications 226, 39-54 (2018)
    10.1016/j.cpc.2018.01.012

[^6]:
    _Wannier localization details:_ Damle Anil, Lin Lin. Disentanglement via entanglement: A unified method for Wannier functions. _SIAM Journal on Scientific Computing_, 39(5) (2018)
    https://doi.org/10.1137/17M1129696

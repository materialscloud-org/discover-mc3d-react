# Superconductivity calculations

### Motivation

Superconductors play an important role in many modern technologies, finding applications in magnetic resonance imaging, maglev trains and large-scale research infrastructure. While many superconductors have been discovered, high temperature superconductors remain elusive, often facing practical challenges such as synthetic difficulty or instability under ambient pressures.

The theoretical background for understanding high temperature superconductivity is still an active area of research and the importance on electron-phonon interactions cannot be understated. Since the materials cloud three-dimensional database (MC3D) provides a large dataset of experimentally synthesised materials, it serves as a foundation for performing high accuracy electron-phonon calculations on known materials.

## supercond-EPW database

This dataset extends the base dataset (PBEsol-v1) and therefore the methodology may slightly differ. Full details are available in the publication[^1].

A high-throughput computational search for novel phonon-mediated superconductors, starting from the Materials Cloud 3-dimensional structure database of experimentally known inorganic stoichiometric compounds.
The dynamical matrix and Allen-Dynes critical temperature ($T_{c}$) were calculated for 4533 non-magnetic metals using a direct and progressively finer sampling of the electron-phonon couplings. 
As an intermediate result, we collect 2825 successful `PhBaseWorkChain`. Based on the dynamical matrices, we performed interpolation of visualized phonon dispersion using the "all" acoustic sum rull[^7](https://www.quantum-espresso.org/Doc/INPUT_MATDYN.html#id4).
For the candidates with the largest $T_{c}$, a process of automated Wannierizations and electron-phonon interpolations was used to identify the most promising 250 dynamically stable structures. For these structures, spectral functions, superconducting bandgaps, and isotropic Migdal-Eliashberg critical temperatures ($T_{c}^{\textrm{iso}}$) were calculated. For $T_{c}^{\textrm{iso}}$ > 5 K, we compute the anisotropic Migdal-Eliashberg critical temperatures ($T_{c}^{\textrm{aniso}}$) which contains 140 materials. For all calculations, we use the "simple" acoustic sum [rule](https://docs.epw-code.org/doc/Inputs.html#asr-typ) which may lead to small soft modes.

---

### Phonon calculation details

The dynamical matrices are calculated in the sub-process `PhBaseWorkChain` in a five-step workchain for electron-phonon coupling. Then subsequent `Q2rBaseWorkChain` and `MatdynBaseWorkChain` are done independently for a visualization of interpolated phonon dispersion. The pseudopotentials used here are from SSSP library[^4] with the planewave cutoff ($E_{\textrm{cut}}$) being the highest value recommended by the library.

In summary, the spliced workflow is:

1. compute ground state property via a scf calculation.
2. compute dynamical matrices via a phonon calculation.
3. compute interatomic force constants.
4. interpolate for visualized phonon dispersion.

---

### Superconductivity details

$T_c$ is computed and reported at three levels of theory with increasing accuracy:

1. Allen-Dynes $T_{c}^{\textrm{AD}}$ refers to the superconducting transition temperature computed with the Allen-Dynes formula:[^2]

$$
k_B T_{c}^{\textrm{AD}} = \frac{\hbar \omega_{\textrm{log}}}{1.2} \exp \Big[ \frac{-1.04(1+\lambda)}{\lambda - \mu^*(1+0.62\lambda)}   \Big],
$$

- $\lambda$: electron-phonon coupling strength
- $\omega_{\textrm{log}}$: logarithmic average of the phonon frequencies
- $\mu^*$: Coulomb screening parameter, chosen to be $\mu^*=0.13$ for all materials

2. The Isotropic $T_{c}^{\textrm{iso}}$ refers to the solution of the isotropic Migdal-Eliashberg superconducting transition temperature and corresponds to _Eqs 29-34 in Ref.[^3]_

3. Finally the Anisotropic $T_{c}^{\textrm{aniso}}$ refers to the solution of the anisotropic Migdal-Eliashberg superconducting transition temperature given by _Eqs 20-28 Ref.[^3]_

---

### EPW calculation details

Due to the high-throughput multistep process undertaken, the open-source workflow manager AiiDA was used.

The initial electron-phonon workchain is a five-step workflow that calculates the Eliashberg spectral function, the pseudopotentials used here are norm-conserving and are those recommended by PseudoDojo v0.5[^5] with the planewave cutoff ($E_{\textrm{cut}}$) being the highest value recommended by the library. This library was used over the SSSP library[^4] because it contains Projector-Augmented wave pseudopotenial (PAW) that have not been extensively tested with the EPW code.

For ensuring accurate phonon calculations on potential superconductors, both Quantum ESPRESSO and EPW was utilised. EPW is necessary here as it specialises in computing electron-phonon interactions using maximally localized wannier functions. This workflow has the following steps:

1. construct wannier functions for the input structure using SCDM-k[^6]
2. compute dynamical matrices and perturbed potentials via a phonon calculation.
3. coarse grids EPW calculations transforamtion to real space.
4. dense grids electron-phonon interpolation to calculate $T_{c}^{\textrm{AD}}$ and $T_{c}^{\textrm{iso}}$
5. fine grids automatic convegence
6. for $T_{c}^{\textrm{iso}}$ > 5 K a final convergence calculation of $T_{c}^{\textrm{aniso}}$ is performed.

---

### Definitions, citations and further reading.

Two types of anisotropic calculation were performed:

- "FBW" refers to the anisotropic full-bandwidth (FBW) Eliashberg equations. _Eqs. 20-25 in Ref.[^3]._
- "FSR" refers to the anisotropic Fermi surface restricted (FSR) Eliashberg equations. _Eqs. 27-28 in Ref.[^3]_

for **k**/**q**-grids the following holds true:

- The coarse **k**-point grid used for the EPW calculation is not necessarily the same as the DFPT **k**-grid.
- The coarse **q**-point grid used for the EPW calculation is always the same as DFPT **q**-grid.
- The fine **k**-point grid is obtained from Fourier/Wannier interpolation.
- The Fine **q**-grid is obtained from Fourier/Wannier interpolation.

Other details:

- $\Delta_{n\mathbf{k}}(0)$ is the value of the superconducting gap (in meV), extrapolated at 0K. It is obtained from a fit of the anisotropic $T_c$ data with a BCS equation.
- The smearing value (_Smearing-q_) refers to the _"degaussq"_ input variable in EPW and is the smearing over q in the electron-phonon coupling in meV.
- The Fermi window refers to the states around the Fermi level included in the superconducting calculation, expressed in eV.
- Number of Wannier functions: Importantly, these are Wannier functions for states around the Fermi level and therefore states deep into the valence or conduction band are sometimes not calculated.
- Following convention $\omega^{\textrm{max}}$ refers to the maximum phonon frequency computed with density functional perturbation theory (DFPT).

---

### References and Further reading:

[^1]:
    _If using this work be sure to cite:_ Marnik Bercx, Samuel Poncé, Yiming Zhang. _et al._ Charting the landscape of Bardeen-Cooper-Schrieffer superconductors in experimentally known compounds. arXiv:2503.10943 (2025).  
    https://journals.aps.org/prxenergy/abstract/10.1103/sb28-fjc9

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


[^7]: _asr all:_ Lin, C., Poncé, S. & Marzari, N. General invariance and equilibrium conditions for lattice dynamics in 1D, 2D, and 3D materials. npj Comput Mater 8, 236 (2022). https://doi.org/10.1038/s41524-022-00920-6
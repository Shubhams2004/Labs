export interface Experiment {
  id: string;
  title: string;
  category: string;
  status: 'Coming Soon';
  tagline: string;
  summary: string;
  objective: string;
  equation: string;
  equationLabel: string;
  variables: {
    independent: string;
    dependent: string;
    controlled: string;
  };
  apparatus: string[];
  protocolSteps: string[];
  scientificPrinciple: string;
}

export const CHEMISTRY_EXPERIMENTS: Experiment[] = [
  {
    id: 'acid-base-titration',
    title: 'Acid–Base Titration',
    category: 'Analytical & Physical Chemistry',
    status: 'Coming Soon',
    tagline: 'Precision volumetric neutralization & pH curve inflection modeling',
    summary:
      'Determine unknown solution concentrations by monitoring hydronium ion neutralization with a standardized titrant, recording volumetric pH inflection curves.',
    objective:
      'To titrate a weak or strong monoprotic acid using standardized sodium hydroxide (0.100 M NaOH), plot the titration curve, identify the equivalence point, and compute the acid dissociation constant (pKa).',
    equation: 'pH = pK_a + \\log_{10}\\left(\\frac{[A^-]}{[HA]}\\right)',
    equationLabel: 'Henderson–Hasselbalch Equation',
    variables: {
      independent: 'Titrant volume delivered (mL)',
      dependent: 'Measured solution pH & electrode potential (mV)',
      controlled: 'Analyte starting volume, titrant concentration (0.100 M), ambient temperature (298.15 K)',
    },
    apparatus: [
      '50.00 mL Class-A precision buret with PTFE stopcock',
      'Combination glass-body pH electrode with automatic temperature compensation (ATC)',
      '250 mL Erlenmeyer analyte flask on variable-speed magnetic stirrer',
      'Phenolphthalein & bromothymol blue chemical indicator stock',
      'Standardized 0.1000 M NaOH titrant and 0.1000 M HCl / CH₃COOH analytes',
    ],
    protocolSteps: [
      'Calibrate the digital pH probe using two-point buffer standards (pH 4.01 and pH 7.00).',
      'Charge the buret with standardized titrant and purge air bubbles from the dispensing tip.',
      'Dispense titrant in controlled 0.50 mL increments (and 0.10 mL increments near the inflection).',
      'Log continuous pH stabilization values and observe the indicator color shift.',
      'Generate the first and second derivative plots (dpH/dV and d²pH/dV²) to pinpoint the equivalence point.',
    ],
    scientificPrinciple:
      'Neutralization between protons (H⁺) and hydroxide ions (OH⁻) produces water. In weak acid-strong base systems, the buffer region resists pH change until near equivalence, where a steep inflection reveals the stoichiometric equivalence volume.',
  },
  {
    id: 'reaction-kinetics',
    title: 'Reaction Kinetics',
    category: 'Physical Chemistry',
    status: 'Coming Soon',
    tagline: 'Rate law determination, activation energy & Arrhenius temperature dependency',
    summary:
      'Investigate the temporal rate of chemical transformations, determine reaction orders via initial rates, and calculate empirical activation energy.',
    objective:
      'To determine the reaction order with respect to iodide and persulfate ions in the iodine clock reaction, and calculate the rate constant (k) across varying temperatures.',
    equation: 'r = k[A]^m[B]^n \\quad \\text{where} \\quad k = A e^{-\\frac{E_a}{RT}}',
    equationLabel: 'Differential Rate Law & Arrhenius Equation',
    variables: {
      independent: 'Initial reactant concentrations [I⁻], [S₂O₈²⁻] and solution temperature (K)',
      dependent: 'Elapsed reaction time (s) to photometric transition & instantaneous rate (mol·L⁻¹·s⁻¹)',
      controlled: 'Total ionic strength, starch indicator concentration, reaction volume (100.0 mL)',
    },
    apparatus: [
      'Split-beam visible spectrophotometer (585 nm absorption channel)',
      'Sub-second precision digital optical stopwatch & trigger sensor',
      'Constant-temperature circulating water bath (285 K – 335 K, ±0.1 K)',
      'Automated micro-dispensers for potassium persulfate, potassium iodide, and sodium thiosulfate',
    ],
    protocolSteps: [
      'Prepare four distinct trial matrices systematically doubling [I⁻] while holding [S₂O₈²⁻] constant.',
      'Initiate rapid mixing and record the latency until the triiodide-starch complex induces opacity.',
      'Repeat kinetic runs across four controlled temperatures from 15.0°C to 45.0°C.',
      'Plot ln(rate) vs. ln[reactant] to derive reaction orders m and n.',
      'Construct an Arrhenius plot (ln k vs. 1/T) to determine the activation energy (Ea) from the slope.',
    ],
    scientificPrinciple:
      'Chemical reaction rates depend on molecular collision frequency, geometric orientation, and kinetic energy exceeding the activation threshold. The rate law expresses this rate as a function of instantaneous reactant concentrations.',
  },
  {
    id: 'chemical-equilibrium',
    title: 'Chemical Equilibrium',
    category: 'General & Physical Chemistry',
    status: 'Coming Soon',
    tagline: 'Le Chatelier perturbations, reaction quotients & thermodynamic equilibrium constants',
    summary:
      'Examine reversible chemical reactions at dynamic equilibrium, test Le Chatelier’s principle under thermal and concentration stress, and measure Kc.',
    objective:
      'To investigate the reversible iron(III)-thiocyanate complex formation (Fe³⁺ + SCN⁻ ⇌ [Fe(SCN)]²⁺) and quantitatively verify the invariance of Kc under concentration shifts.',
    equation: 'K_c = \\frac{[[Fe(SCN)]^{2+}]}{[Fe^{3+}][SCN^-]} \\quad | \\quad \\Delta G^\\circ = -RT \\ln K',
    equationLabel: 'Equilibrium Constant Expression',
    variables: {
      independent: 'Added stressor volumes (Fe(NO₃)₃, KSCN, or Ag⁺ precipitant) and temperature (K)',
      dependent: 'Absorbance at 447 nm, equilibrium concentrations, and reaction quotient Q',
      controlled: 'Background nitric acid concentration [HNO₃] (0.50 M) to suppress iron hydrolysis',
    },
    apparatus: [
      'Digital colorimeter with 447 nm bandpass filter',
      'Matched 1.00 cm optical path length quartz cuvettes',
      'Volumetric micro-pipettes (100–1000 µL range)',
      'Thermal jacketed cell holder connected to Peltier temperature regulator',
    ],
    protocolSteps: [
      'Establish a Beer–Lambert calibration curve using known standard concentrations of [Fe(SCN)]²⁺.',
      'Prepare test equilibrium mixtures with varying Fe³⁺ to SCN⁻ initial ratios.',
      'Measure absorbance at 447 nm once dynamic equilibrium is established.',
      'Perturb the system by adding a dropwise stressor or altering temperature and observe shifts in Q vs. Kc.',
      'Compute equilibrium concentrations and verify that Kc remains invariant within experimental uncertainty.',
    ],
    scientificPrinciple:
      'Dynamic equilibrium represents a state where the forward and reverse reaction rates are equal. When a disturbance is applied to an equilibrium mixture, the system shifts in the direction that counteracts the disturbance.',
  },
  {
    id: 'electrochemistry',
    title: 'Electrochemistry',
    category: 'Physical Chemistry',
    status: 'Coming Soon',
    tagline: 'Galvanic cell potentials, Nernst concentration dependency & redox thermodynamics',
    summary:
      'Construct virtual electrochemical cells, measure standard and non-standard cell potentials (E_cell), and apply the Nernst equation to determine reaction Gibbs energy.',
    objective:
      'To assemble a Daniell galvanic cell (Zn|Zn²⁺ || Cu²⁺|Cu), measure the electromotive force under standard and varying ion concentrations, and verify the Nernst relationship.',
    equation: 'E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{RT}{nF} \\ln Q',
    equationLabel: 'Nernst Equation',
    variables: {
      independent: 'Half-cell electrolyte concentrations ([Cu²⁺], [Zn²⁺]) and electrode materials',
      dependent: 'Open-circuit cell potential (V) and electron flow direction',
      controlled: 'Salt bridge electrolyte (saturated KNO₃ in agar), ambient pressure (1.00 bar), temperature (298.15 K)',
    },
    apparatus: [
      'High-input-impedance digital multimeter / electrometer (10 GΩ input resistance, 0.1 mV resolution)',
      'High-purity metallic electrode strips (Zinc, Copper, Silver, Nickel)',
      'Twin glass half-cell beakers with porous glass frit and agar-KNO₃ salt bridge',
      'Surface emery polish pads for standard electrode pretreatments',
    ],
    protocolSteps: [
      'Polish metal electrode strips to remove surface oxide passivations before immersion.',
      'Prepare standard 1.00 M solutions of ZnSO₄ and CuSO₄ in respective half-cells.',
      'Complete the ionic circuit using the saturated salt bridge and log standard EMF (E°cell ≈ 1.10 V).',
      'Dilute one half-cell sequentially across 3 orders of magnitude (1.00 M down to 0.001 M).',
      'Plot Ecell against ln(Q) and extract the slope to compare with the theoretical value (RT/nF).',
    ],
    scientificPrinciple:
      'Spontaneous redox reactions generate an electrical potential difference driven by Gibbs free energy change (ΔG = -nFE). The Nernst equation describes how ion concentration gradients affect cell potential away from standard state.',
  },
  {
    id: 'thermochemistry',
    title: 'Thermochemistry',
    category: 'Thermodynamics & Physical Chemistry',
    status: 'Coming Soon',
    tagline: 'Calorimetry, enthalpy of neutralization & Hess’s law thermodynamic cycles',
    summary:
      'Perform virtual solution calorimetry, measure temperature trajectories under adiabatic insulation, and compute reaction enthalpies using Hess’s law.',
    objective:
      'To measure the heat of neutralization between hydrochloric acid and sodium hydroxide, determine the calorimeter heat capacity (C_cal), and verify enthalpy additivity via Hess’s law.',
    equation: 'q_{\\text{rxn}} = -\\left(m_{\\text{soln}} c_{\\text{soln}} \\Delta T + C_{\\text{cal}} \\Delta T\\right) \\quad | \\quad \\Delta H = \\frac{q_{\\text{rxn}}}{n}',
    equationLabel: 'First Law Calorimetric Energy Balance',
    variables: {
      independent: 'Reactant combinations (HCl + NaOH, NaOH + NH₄Cl, etc.) and reactant masses',
      dependent: 'Temperature-time profile (T vs. t), maximum ΔT, and calculated enthalpy (kJ·mol⁻¹)',
      controlled: 'Total combined solution volume (100.0 mL), stirring rate (300 RPM), insulation efficiency',
    },
    apparatus: [
      'Dual-walled vacuum insulated calorimeter with sealed silicone septum',
      'Precision thermistor temperature probe (0.01°C sensitivity, 10 Hz sampling)',
      'Submersible low-shear magnetic paddle stirrer',
      'Analytical top-loading balance (0.001 g resolution)',
    ],
    protocolSteps: [
      'Calibrate the calorimeter constant (Ccal) using a warm water / cold water mixing protocol.',
      'Equilibrate 50.0 mL of 1.00 M HCl and 50.0 mL of 1.00 M NaOH to uniform starting temperature.',
      'Inject base rapidly into the calorimeter and record continuous temperature data for 300 seconds.',
      'Extrapolate temperature decay curves to the time of mixing to account for non-ideal heat leakage.',
      'Calculate the molar enthalpy of neutralization (ΔH_neut ≈ -57.1 kJ·mol⁻¹) and estimate standard uncertainty.',
    ],
    scientificPrinciple:
      'Under constant pressure, reaction heat equals the system enthalpy change (q_p = ΔH). Energy conservation dictates that heat released by the chemical reaction is quantitatively absorbed by the solvent and calorimetric vessel.',
  },
];

export interface PhysicsDomain {
  name: string;
  focus: string;
  experiments: string[];
}

export const PHYSICS_ROADMAP: PhysicsDomain[] = [
  {
    name: 'Mechanics & Dynamics',
    focus: 'Kinematic trajectories, harmonic motion, momentum conservation, and rotational dynamics.',
    experiments: [
      'Coupled Harmonic Oscillators & Resonance',
      '2D Projectile Trajectory with Viscous Drag',
      'Inelastic Collisions & Linear Momentum Conservation',
    ],
  },
  {
    name: 'Wave Optics & Photonics',
    focus: 'Wave-particle duality, diffraction gratings, thin-film interference, and Snell’s laws.',
    experiments: [
      'Young’s Double-Slit Optical Interference',
      'Diffraction Grating Spectrometry & Wavelength Measurement',
      'Polarization & Malus’s Law',
    ],
  },
  {
    name: 'Electromagnetism',
    focus: 'Magnetic flux induction, Lorentz force, resonant RLC circuits, and electric fields.',
    experiments: [
      'Faraday’s Induction & Lenz’s Law Verification',
      'RLC Circuit Frequency Response & Q-Factor',
      'Charge-to-Mass Ratio (e/m) in Helmholtz Coils',
    ],
  },
  {
    name: 'Thermodynamics & Stat Mech',
    focus: 'Ideal gas behavior, Carnot cycle efficiency, heat engines, and Brownian motion.',
    experiments: [
      'Ideal Gas Adiabatic Expansion & Poisson’s Ratio (γ)',
      'Carnot Engine PV & TS Thermodynamic Cycles',
      'Thermal Conductivity of Solid Conductors',
    ],
  },
];

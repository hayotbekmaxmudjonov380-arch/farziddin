export interface ElementInfo {
  symbol: string;
  atomicNumber: number; // Z: Protons = Electrons
  atomicMass: number;   // Ar
  neutrons: number;     // N = Ar - Z
  name: {
    uz: string;
    en: string;
    ru: string;
  };
  shells: number[];     // Electrons per shell [K, L, M]
  electronConfig: string;
  category: {
    uz: string;
    en: string;
    ru: string;
  };
  valency: string;
  color: string;
  glowColor: string;
  description: {
    uz: string;
    en: string;
    ru: string;
  };
}

export interface MoleculeAtom {
  element: string; // 'H' | 'C' | 'O' | 'N'
  position: [number, number, number];
  radius: number;
  color: string;
  label: string;
}

export interface MoleculeBond {
  from: number;
  to: number;
  type: 'single' | 'double';
}

export interface MoleculeInfo {
  id: string;
  formula: string;
  name: {
    uz: string;
    en: string;
    ru: string;
  };
  bondAngle: string;
  geometry: {
    uz: string;
    en: string;
    ru: string;
  };
  molarMass: string;
  bondType: {
    uz: string;
    en: string;
    ru: string;
  };
  description: {
    uz: string;
    en: string;
    ru: string;
  };
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
}

export const ELEMENTS: ElementInfo[] = [
  {
    symbol: 'H',
    atomicNumber: 1,
    atomicMass: 1.008,
    neutrons: 0, // Eng ko'p tarqalgan izotop: protium 1H (0 neytron)
    name: {
      uz: 'Vodorod',
      en: 'Hydrogen',
      ru: 'Водород',
    },
    shells: [1], // 1s¹
    electronConfig: '1s¹',
    category: {
      uz: 'Oddiy nometall (Gaz)',
      en: 'Reactive nonmetal',
      ru: 'Неметалл',
    },
    valency: 'I',
    color: '#38bdf8',
    glowColor: '#7dd3fc',
    description: {
      uz: "Koinotdagi eng yengil va eng ko'p tarqalgan element. 1 ta proton va 1 ta elektrondan iborat.",
      en: "The lightest and most abundant chemical element in the universe. Consists of 1 proton and 1 electron.",
      ru: "Самый лёгкий и распространённый элемент во Вселенной. Состоит из 1 протона и 1 электрона.",
    },
  },
  {
    symbol: 'C',
    atomicNumber: 6,
    atomicMass: 12.011,
    neutrons: 6, // 12C: 6 proton, 6 neytron
    name: {
      uz: 'Uglerod',
      en: 'Carbon',
      ru: 'Углерод',
    },
    shells: [2, 4], // 1s² 2s² 2p²
    electronConfig: '1s² 2s² 2p²',
    category: {
      uz: 'Organik asos (Nometall)',
      en: 'Polyatomic nonmetal',
      ru: 'Неметалл',
    },
    valency: 'IV, II',
    color: '#2dffb0',
    glowColor: '#10e68a',
    description: {
      uz: "Barcha organik hayotning kimyoviy asosi. 4 ta valent elektronli bo'lib, murakkab zanjirlar hosil qiladi.",
      en: "The chemical basis of all known organic life. Forms versatile tetravalent covalent bonds.",
      ru: "Химическая основа всей органической жизни. Обладает способностью образовывать длинные полимерные цепи.",
    },
  },
  {
    symbol: 'O',
    atomicNumber: 8,
    atomicMass: 15.999,
    neutrons: 8, // 16O: 8 proton, 8 neytron
    name: {
      uz: 'Kislorod',
      en: 'Oxygen',
      ru: 'Кислород',
    },
    shells: [2, 6], // 1s² 2s² 2p⁴
    electronConfig: '1s² 2s² 2p⁴',
    category: {
      uz: 'Xalkogen (Gaz)',
      en: 'Reactive nonmetal',
      ru: 'Халькоген',
    },
    valency: 'II',
    color: '#ef4444',
    glowColor: '#f43f5e',
    description: {
      uz: "Yer qobig'ida va tirik organizmlarda eng keng tarqalgan, nafas olish va oksidlanishning asosiy elementi.",
      en: "Essential for respiration and combustion, highly electronegative reactive nonmetal.",
      ru: "Жизненно важный элемент для дыхания и горения, сильный окислитель.",
    },
  },
  {
    symbol: 'Na',
    atomicNumber: 11,
    atomicMass: 22.990,
    neutrons: 12, // 23Na: 11 proton, 12 neytron
    name: {
      uz: 'Natriy',
      en: 'Sodium',
      ru: 'Натрий',
    },
    shells: [2, 8, 1], // [Ne] 3s¹
    electronConfig: '[Ne] 3s¹',
    category: {
      uz: 'Ishqoriy metall',
      en: 'Alkali metal',
      ru: 'Щелочной металл',
    },
    valency: 'I',
    color: '#f5c842',
    glowColor: '#ffd966',
    description: {
      uz: "Yuqori kimyoviy faollikka ega bo'lgan yumshoq ishqoriy metall. Tashqi qavatdagi 1 ta elektronini oson beradi.",
      en: "Highly reactive, soft alkali metal with a single valence electron readily participating in ionic bonding.",
      ru: "Мягкий щелочной металл высокой химической активности с 1 валентным электроном.",
    },
  },
  {
    symbol: 'Cl',
    atomicNumber: 17,
    atomicMass: 35.453,
    neutrons: 18, // 35Cl: 17 proton, 18 neytron
    name: {
      uz: 'Xlor',
      en: 'Chlorine',
      ru: 'Хлор',
    },
    shells: [2, 8, 7], // [Ne] 3s² 3p⁵
    electronConfig: '[Ne] 3s² 3p⁵',
    category: {
      uz: 'Galogen',
      en: 'Halogen',
      ru: 'Галоген',
    },
    valency: 'I, III, V, VII',
    color: '#10e68a',
    glowColor: '#2dffb0',
    description: {
      uz: "Kuchli oksidlovchi sariq-yashil gaz. 1 ta elektron qabul qilib, barqaror oktet qavatga ega bo'ladi.",
      en: "Extremely reactive halogen and powerful oxidizer with 7 valence electrons.",
      ru: "Активный галоген с 7 валентными электронами, стремящийся к устойчивому октету.",
    },
  },
];

// Calculation of realistic bond geometries:
// H2O: O at (0, 0, 0), angle = 104.5 deg.
// Half angle = 52.25 deg = 0.9119 rad.
// d_OH = 1.45
const h2o_d = 1.42;
const h2o_halfRad = (104.5 * Math.PI) / 360; // 52.25 deg

// CH4: C at (0,0,0), regular tetrahedron, angle = 109.5 deg.
// Tetrahedral vertices: (1,1,1), (-1,-1,1), (-1,1,-1), (1,-1,-1) normalized * d_CH
const ch4_d = 1.42;
const ch4_norm = ch4_d / Math.sqrt(3);

// CO2: C at (0, 0, 0), linear, angle = 180 deg.
const co2_d = 1.48;

export const MOLECULES: MoleculeInfo[] = [
  {
    id: 'H2O',
    formula: 'H₂O',
    name: {
      uz: 'Suv',
      en: 'Water',
      ru: 'Вода',
    },
    bondAngle: '104.5°',
    geometry: {
      uz: 'Burchakli (V-simon)',
      en: 'Bent (V-shape)',
      ru: 'Угловая (V-образная)',
    },
    molarMass: '18.015 g/mol',
    bondType: {
      uz: 'Kovalent qutbli',
      en: 'Polar covalent',
      ru: 'Ковалентная полярная',
    },
    description: {
      uz: "Kisloroddagi 2 ta bo'linmagan elektron juftlari itarishishi natijasida bog' burchagi 104.5° ni tashkil etadi.",
      en: "Lone pair electron repulsion on oxygen compresses the H-O-H bond angle to 104.5°.",
      ru: "Отталкивание неподелённых электронных пар кислорода сжимает угол H-O-H до 104.5°.",
    },
    atoms: [
      {
        element: 'O',
        position: [0, 0.25, 0],
        radius: 0.52,
        color: '#ef4444',
        label: 'O',
      },
      {
        element: 'H',
        position: [
          Math.sin(h2o_halfRad) * h2o_d,
          0.25 - Math.cos(h2o_halfRad) * h2o_d,
          0,
        ],
        radius: 0.32,
        color: '#f8fafc',
        label: 'H',
      },
      {
        element: 'H',
        position: [
          -Math.sin(h2o_halfRad) * h2o_d,
          0.25 - Math.cos(h2o_halfRad) * h2o_d,
          0,
        ],
        radius: 0.32,
        color: '#f8fafc',
        label: 'H',
      },
    ],
    bonds: [
      { from: 0, to: 1, type: 'single' },
      { from: 0, to: 2, type: 'single' },
    ],
  },
  {
    id: 'CH4',
    formula: 'CH₄',
    name: {
      uz: 'Metan',
      en: 'Methane',
      ru: 'Метан',
    },
    bondAngle: '109.5°',
    geometry: {
      uz: 'Muntazam tetraedr',
      en: 'Tetrahedral',
      ru: 'Тетраэдрическая',
    },
    molarMass: '16.043 g/mol',
    bondType: {
      uz: 'Kovalent kuchsiz qutbli',
      en: 'Non-polar covalent',
      ru: 'Ковалентная малополярная',
    },
    description: {
      uz: "Uglerod atomi sp³ gibridlanishda bo'lib, 4 ta vodorod bilan fazoviy simmetrik tetraedr (109.5°) hosil qiladi.",
      en: "Carbon is sp³ hybridized, creating a spatially balanced 109.5° tetrahedral molecular symmetry.",
      ru: "Атом углерода в sp³-гибридизации формирует идеальный тетраэдр с углами 109.5°.",
    },
    atoms: [
      {
        element: 'C',
        position: [0, 0, 0],
        radius: 0.48,
        color: '#475569',
        label: 'C',
      },
      {
        element: 'H',
        position: [ch4_norm, ch4_norm, ch4_norm],
        radius: 0.3,
        color: '#f8fafc',
        label: 'H',
      },
      {
        element: 'H',
        position: [-ch4_norm, -ch4_norm, ch4_norm],
        radius: 0.3,
        color: '#f8fafc',
        label: 'H',
      },
      {
        element: 'H',
        position: [-ch4_norm, ch4_norm, -ch4_norm],
        radius: 0.3,
        color: '#f8fafc',
        label: 'H',
      },
      {
        element: 'H',
        position: [ch4_norm, -ch4_norm, -ch4_norm],
        radius: 0.3,
        color: '#f8fafc',
        label: 'H',
      },
    ],
    bonds: [
      { from: 0, to: 1, type: 'single' },
      { from: 0, to: 2, type: 'single' },
      { from: 0, to: 3, type: 'single' },
      { from: 0, to: 4, type: 'single' },
    ],
  },
  {
    id: 'CO2',
    formula: 'CO₂',
    name: {
      uz: 'Karbonat angidrid',
      en: 'Carbon dioxide',
      ru: 'Углекислый газ',
    },
    bondAngle: '180°',
    geometry: {
      uz: 'Chiziqli (Linear)',
      en: 'Linear',
      ru: 'Линейная',
    },
    molarMass: '44.010 g/mol',
    bondType: {
      uz: 'Kovalent qutbli (Qo‘shbog‘)',
      en: 'Double covalent bonds',
      ru: 'Ковалентная полярная (Двойная)',
    },
    description: {
      uz: "Uglerod atomi sp gibridlanishda. Har ikki kislorod bilan mustahkam qo'shbog' (O=C=O) orqali 180° to'g'ri chiziq hosil qiladi.",
      en: "Linear geometry from sp carbon forming rigid double bonds with two oxygens (O=C=O) at 180°.",
      ru: "Линейная конфигурация sp-гибридного углерода с прочными двойными связями (O=C=O) под углом 180°.",
    },
    atoms: [
      {
        element: 'C',
        position: [0, 0, 0],
        radius: 0.46,
        color: '#475569',
        label: 'C',
      },
      {
        element: 'O',
        position: [-co2_d, 0, 0],
        radius: 0.52,
        color: '#ef4444',
        label: 'O',
      },
      {
        element: 'O',
        position: [co2_d, 0, 0],
        radius: 0.52,
        color: '#ef4444',
        label: 'O',
      },
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'double' },
    ],
  },
];

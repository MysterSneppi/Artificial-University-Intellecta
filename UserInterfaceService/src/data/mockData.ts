import { Block, Transaction, TransactionType, Student, Institution, SimulationState } from '../types';

// Generate a random hash
const generateHash = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Mock Blocks Data
export const mockBlocks: Block[] = Array.from({ length: 10 }, (_, i) => ({
  id: 123 + i,
  timestamp: new Date(Date.now() - (i * 600000)).toISOString(),
  hash: generateHash(),
  previousHash: i === 0 ? '0000000000000000' : generateHash(),
  data: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
    id: `tx-${i}-${j}`,
    type: Object.values(TransactionType)[Math.floor(Math.random() * 4)],
    entityId: `entity-${Math.floor(Math.random() * 100)}`,
    data: {
      value: Math.random() * 100,
      metadata: 'Some educational data',
    },
    timestamp: new Date(Date.now() - (i * 600000) - (j * 60000)).toISOString(),
  })),
  difficulty: 4,
  nonce: Math.floor(Math.random() * 10000),
}));

// Mock Students Data
export const mockStudents: Student[] = Array.from({ length: 20 }, (_, i) => ({
  id: `s-${i+1}`,
  name: `Student ${i+1}`,
  enrollmentDate: new Date(Date.now() - (Math.random() * 31536000000)).toISOString(),
  institutionId: `inst-${Math.floor(Math.random() * 5) + 1}`,
  grades: {
    math: Math.floor(Math.random() * 30) + 70,
    science: Math.floor(Math.random() * 30) + 70,
    literature: Math.floor(Math.random() * 30) + 70,
    history: Math.floor(Math.random() * 30) + 70,
  },
  performanceIndex: Math.floor(Math.random() * 50) + 50,
}));

// Mock Institutions Data
export const mockInstitutions: Institution[] = [
  {
    id: 'inst-1',
    name: 'Tech University',
    foundedYear: 1985,
    location: 'New York',
    rating: 4.7,
    studentCount: 1245,
    courses: 67,
  },
  {
    id: 'inst-2',
    name: 'Liberal Arts College',
    foundedYear: 1932,
    location: 'Boston',
    rating: 4.2,
    studentCount: 845,
    courses: 42,
  },
  {
    id: 'inst-3',
    name: 'Science Institute',
    foundedYear: 1992,
    location: 'San Francisco',
    rating: 4.9,
    studentCount: 1120,
    courses: 56,
  },
  {
    id: 'inst-4',
    name: 'Global Academy',
    foundedYear: 2005,
    location: 'Chicago',
    rating: 4.0,
    studentCount: 950,
    courses: 38,
  },
  {
    id: 'inst-5',
    name: 'Creative Design School',
    foundedYear: 2010,
    location: 'Los Angeles',
    rating: 4.5,
    studentCount: 675,
    courses: 29,
  },
];

// Mock Simulation State
export const mockSimulationState: SimulationState = {
  isRunning: false,
  currentBlock: 124,
  currentSemester: 2,
  speed: 1,
  elapsedTime: '02:45:32',
};

// Mock Chart Data
export const mockPerformanceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Average Student Performance',
      data: [65, 69, 73, 71, 76, 79],
      borderColor: '#A2D2FF',
      backgroundColor: 'rgba(162, 210, 255, 0.2)',
      borderWidth: 2,
      fill: true,
    },
    {
      label: 'Institution Rating',
      data: [70, 72, 75, 82, 85, 88],
      borderColor: '#77DD77',
      backgroundColor: 'rgba(119, 221, 119, 0.2)',
      borderWidth: 2,
      fill: true,
    },
  ],
};

export const mockInstitutionComparisonData = {
  labels: ['Student Satisfaction', 'Course Completion', 'Employment Rate', 'Research Output', 'Faculty Rating'],
  datasets: [
    {
      label: 'Tech University',
      data: [85, 80, 90, 95, 82],
      backgroundColor: 'rgba(162, 210, 255, 0.7)',
    },
    {
      label: 'Liberal Arts College',
      data: [90, 75, 70, 65, 89],
      backgroundColor: 'rgba(119, 221, 119, 0.7)',
    },
    {
      label: 'Science Institute',
      data: [78, 92, 86, 93, 79],
      backgroundColor: 'rgba(43, 58, 85, 0.7)',
    },
  ],
};

export const mockTransactionsPerDay = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Transactions',
      data: [65, 89, 73, 102, 85, 52, 43],
      backgroundColor: '#2B3A55',
    },
  ],
};

// Mock transactions for Timeline
export const mockRecentTransactions: Transaction[] = Array.from({ length: 8 }, (_, i) => ({
  id: `tx-recent-${i}`,
  type: Object.values(TransactionType)[Math.floor(Math.random() * 4)],
  entityId: `entity-${Math.floor(Math.random() * 100)}`,
  data: {
    value: Math.random() * 100,
    metadata: `Data entry ${i+1}`,
  },
  timestamp: new Date(Date.now() - (i * 3600000)).toISOString(),
}));
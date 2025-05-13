export interface Block {
  id: number;
  timestamp: string;
  hash: string;
  previousHash: string;
  data: Transaction[];
  difficulty: number;
  nonce: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  entityId: string;
  data: Record<string, any>;
  timestamp: string;
}

export enum TransactionType {
  ENROLLMENT = 'ENROLLMENT',
  GRADE = 'GRADE',
  COURSE_COMPLETION = 'COURSE_COMPLETION',
  INSTITUTION_UPDATE = 'INSTITUTION_UPDATE'
}

export interface Student {
  id: string;
  name: string;
  enrollmentDate: string;
  institutionId: string;
  grades: Record<string, number>;
  performanceIndex: number;
}

export interface Institution {
  id: string;
  name: string;
  foundedYear: number;
  location: string;
  rating: number;
  studentCount: number;
  courses: number;
}

export interface SimulationState {
  isRunning: boolean;
  currentBlock: number;
  currentSemester: number;
  speed: number;
  elapsedTime: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
}
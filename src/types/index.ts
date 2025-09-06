// Core VaultorVerse Types
export interface Market {
  id: string;
  question: string;
  description: string;
  outcomes: Outcome[];
  endTime: Date;
  totalVolume: bigint;
  resolved: boolean;
  winningOutcome?: number;
  category: MarketCategory;
  tags: string[];
  createdAt: Date;
}

export interface Outcome {
  id: number;
  name: string;
  odds: number;
  liquidity: bigint;
  color: string;
}

export interface Position {
  id: string;
  marketId: string;
  userId: string;
  outcome: number;
  amount: bigint;
  shieldEnabled: boolean;
  shieldPercentage: number;
  timestamp: Date;
  pnl?: bigint;
}

export interface Shield {
  percentage: number;
  cost: bigint;
  available: boolean;
}

export interface VaultorEvent {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  duration: number; // in minutes
  questions: EventQuestion[];
  participants: number;
  status: EventStatus;
}

export interface EventQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: number;
  timeLimit: number; // in seconds
}

export interface TokenUtility {
  version: TokenVersion;
  benefits: string[];
  stakingMultiplier: number;
  shieldDiscount: number;
  governanceWeight: number;
}

export enum TokenVersion {
  V1 = 'V1',
  V2 = 'V2',
  V3 = 'V3',
  V4 = 'V4',
  V5 = 'V5',
}

export enum MarketCategory {
  CRYPTO = 'CRYPTO',
  POLITICS = 'POLITICS',
  SPORTS = 'SPORTS',
  ENTERTAINMENT = 'ENTERTAINMENT',
  TECHNOLOGY = 'TECHNOLOGY',
  ECONOMICS = 'ECONOMICS',
}

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: string;
  address: string;
  username?: string;
  avatar?: string;
  totalPnl: bigint;
  winRate: number;
  streak: number;
  level: number;
  achievements: Achievement[];
  tokenBalances: Record<TokenVersion, bigint>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}
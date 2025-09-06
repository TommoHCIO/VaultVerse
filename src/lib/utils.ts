import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | bigint, currency = "USD"): string {
  const numValue = typeof value === 'bigint' ? Number(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(numValue);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function formatTimeRemaining(endTime: Date): string {
  const now = new Date();
  const timeDiff = endTime.getTime() - now.getTime();
  
  if (timeDiff <= 0) return "Ended";
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function calculateOdds(liquidity: bigint, totalLiquidity: bigint): number {
  if (totalLiquidity === 0n) return 0;
  const liquidityNum = Number(liquidity);
  const totalLiquidityNum = Number(totalLiquidity);
  return (liquidityNum / totalLiquidityNum) * 100;
}

export function generateMarketId(): string {
  return `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')}`;
}

export function truncateAddress(address: string, start = 6, end = 4): string {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function getShieldColor(percentage: number): string {
  if (percentage >= 30) return 'shield-gold';
  if (percentage >= 20) return 'shield-silver';
  return 'shield-bronze';
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Address } from 'viem';
import { useState } from 'react';

// Placeholder ABI - will be replaced with actual contract ABI
const VAULTOR_ABI = [
  {
    name: 'placeBet',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'marketId', type: 'bytes32' },
      { name: 'outcome', type: 'uint8' },
      { name: 'amount', type: 'uint256' },
      { name: 'enableShield', type: 'bool' },
    ],
    outputs: [],
  },
  {
    name: 'getMarket',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'marketId', type: 'bytes32' }],
    outputs: [
      { name: 'question', type: 'string' },
      { name: 'endTime', type: 'uint256' },
      { name: 'resolved', type: 'bool' },
    ],
  },
] as const;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VAULTOR_CONTRACT_ADDRESS as Address;

export function useVaultorContract() {
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  
  const { writeContract, data: hash, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({
      hash,
    });

  const placeBet = async (
    marketId: string,
    outcome: number,
    amount: bigint,
    enableShield: boolean = false
  ) => {
    setIsPlacingBet(true);
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: VAULTOR_ABI,
        functionName: 'placeBet',
        args: [marketId as `0x${string}`, outcome, amount, enableShield],
        value: amount,
      });
    } finally {
      setIsPlacingBet(false);
    }
  };

  const getMarket = (marketId: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESS,
      abi: VAULTOR_ABI,
      functionName: 'getMarket',
      args: [marketId as `0x${string}`],
    });
  };

  return {
    placeBet,
    getMarket,
    isPlacingBet: isPlacingBet || isConfirming,
    isConfirmed,
    transactionHash: hash,
    error,
  };
}
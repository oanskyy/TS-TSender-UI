/* eslint-disable no-console */
import { erc20Abi } from '@/constans';
import { readContract } from '@wagmi/core';
import { toast } from 'sonner';
import { useAccount, useConfig } from 'wagmi';

type AllowanceParams = {
  token: string;
  spender: string;
};

export function useAllowance({ token, spender }: AllowanceParams): {
  getAllowance: () => Promise<bigint>;
} {
  const config = useConfig();
  const { address: ownerWalletAddress } = useAccount();

  const getAllowance = async (): Promise<bigint> => {
    if (!token || !ownerWalletAddress || !spender) return BigInt(0);
    // Read the current allowance from the ERC20 contract
    console.log('📖 Reading allowance from contract...');
    try {
      const allowance = await readContract(config, {
        abi: erc20Abi,
        address: token as `0x${string}`,
        functionName: 'allowance',
        args: [ownerWalletAddress, spender],
      });
      console.log('✅ readContract allowance response:', allowance);
      toast.success(`Allowance read successfully: ${allowance}`);
      return allowance as bigint;
    } catch (error) {
      console.error('❌ Error reading allowance:', error);
      toast.error('❌ Failed to read allowance. Please try again.');
      return BigInt(0);
    }
  };

  return { getAllowance };
}

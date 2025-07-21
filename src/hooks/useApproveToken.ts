/* eslint-disable no-console */
import { erc20Abi } from '@/constans';
import { waitForTransactionReceipt } from '@wagmi/core';
import { toast } from 'sonner';
import { useAccount, useConfig, useWriteContract } from 'wagmi';

type ApproveParams = {
  token: string;
  spender: string;
  amount: bigint;
};

export function useApproveToken() {
  const { address: owner } = useAccount();
  const config = useConfig();

  const { writeContractAsync, isPending, error } = useWriteContract();

  const approveToken = async ({ token, spender, amount }: ApproveParams) => {
    console.log('🔐 Approving token spend...');

    try {
      const txHash = await writeContractAsync({
        address: token as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spender, amount],
        account: owner,
        gas: BigInt(100_000),
      });

      console.log('✅ Approve tx sent:', txHash);
      toast.info('⏳ Waiting for approval confirmation...');

      const receipt = await waitForTransactionReceipt(config, { hash: txHash });

      if (receipt.status !== 'success') {
        throw new Error('Approval transaction failed');
      }

      toast.success('✅ Token approved successfully');
      return { txHash, receipt };
    } catch (err) {
      console.error('❌ Approval failed:', err);
      toast.error('❌ Token approval failed');
      throw err;
    }
  };

  return { approveToken, isApproving: isPending, approveError: error };
}
// This hook provides a function to approve a token for spending by a specified spender address.

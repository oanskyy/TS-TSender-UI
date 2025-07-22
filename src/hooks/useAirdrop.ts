/* eslint-disable no-console */
import { erc20Abi, tsenderAbi } from '@/constans';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { toast } from 'sonner';
import { useAccount, useConfig, useWriteContract } from 'wagmi';

type AirdropParams = {
  contract: string;
  token: string;
  recipients: string[];
  amounts: bigint[];
  total: bigint;
};

type ReceiptType = Awaited<ReturnType<typeof waitForTransactionReceipt>>;

export function useAirdrop() {
  const config = useConfig();
  const { address: sender } = useAccount();

  const { writeContractAsync, isPending, error } = useWriteContract();

  const sendAirdrop = async ({
    contract,
    token,
    recipients,
    amounts,
    total,
  }: AirdropParams): Promise<{
    txHash: `0x${string}`;
    receipt: ReceiptType;
  }> => {
    try {
      toast.info('🚀 Sending airdrop transaction...');
      console.log('🚀 Sending airdrop tx...');

      const txHash = await writeContractAsync({
        address: contract as `0x${string}`,
        abi: tsenderAbi,
        functionName: 'airdropERC20',
        args: [token, recipients, amounts, total],
        account: sender,
        gas: BigInt(300_000),
      });

      console.log('✅ Airdrop tx hash:', txHash);
      toast.info('⏳ Waiting for airdrop confirmation...');

      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash,
      });

      if (receipt.status !== 'success') {
        throw new Error('Airdrop transaction failed');
      }

      toast.success('🎉 Airdrop confirmed!');
      return { txHash, receipt };
    } catch (err) {
      console.error('❌ Airdrop failed:', err);
      toast.error('❌ Airdrop transaction failed');
      throw err;
    }
  };

  const getBalances = async (
    token: string,
    recipients: string[],
  ): Promise<bigint[]> => {
    const results = await Promise.all(
      recipients.map(async (recipient) => {
        const balance = await readContract(config, {
          abi: erc20Abi,
          address: token as `0x${string}`,
          functionName: 'balanceOf',
          args: [recipient],
        });
        return balance as bigint;
      }),
    );
    return results;
  };

  return {
    sendAirdrop,
    getBalances,
    isSending: isPending,
    sendError: error,
  };
}
// This hook provides a function to send an airdrop of ERC20 tokens to multiple recipients.
// It also includes a function to get the token balances of the recipients after the airdrop

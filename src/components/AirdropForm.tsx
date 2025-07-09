/* eslint-disable no-console */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { chainsToTSender, tsenderAbi, erc20Abi } from '@/constans';
import { useChainId, useAccount, useConfig, useWriteContract } from 'wagmi';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import {
  calculateAmountList,
  calculateTotalWei,
  calculateTotalTokens,
} from '@/lib/calculateTotal';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMemo } from 'react';

const FormSchema = z.object({
  tokenAddress: z.string().min(2, { message: 'Token address is required.' }),
  recipients: z
    .string()
    .min(1, { message: 'At least one recipient is required.' }),
  amounts: z.string().min(1, { message: 'At least one amount is required.' }),
});

type FormValues = z.infer<typeof FormSchema>;

export default function AirdropForm() {
  const chainId = useChainId();
  const { address: walletAddress } = useAccount();
  const config = useConfig();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tokenAddress: '',
      recipients: '',
      amounts: '',
    },
  });

  const watchedAmounts = useWatch({ control: form.control, name: 'amounts' });
  const amountList = useMemo(
    () => calculateAmountList(watchedAmounts),
    [watchedAmounts],
  );
  const totalAmountInWei = useMemo(
    () => calculateTotalWei(amountList),
    [amountList],
  );
  const totalTokens: number = useMemo(
    () => calculateTotalTokens(totalAmountInWei),
    [totalAmountInWei],
  );

  const {
    writeContractAsync: approveWriteAsync,
    isPending: isApproving,
    error: approveError,
  } = useWriteContract();

  const {
    writeContractAsync: sendWriteAsync,
    isPending: isSending,
    error: sendError,
  } = useWriteContract();

  async function getApprovedAmount(tokenAddress: string, spender: string) {
    if (!tokenAddress || !walletAddress) {
      toast.error('Please connect your wallet and enter a token address.');
      return BigInt(0);
    }
    try {
      const response = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: 'allowance',
        args: [walletAddress, spender],
      });
      console.log('readContract allowance response:', response);
      return response as bigint;
    } catch (error) {
      console.error('Error reading allowance:', error);
      toast.error('Failed to read allowance. Please try again.');
      return BigInt(0);
    }
  }

  async function onSubmit(data: FormValues) {
    const tsenderAddress = chainsToTSender[chainId]['tsender'];
    const total = totalAmountInWei;

    console.log('📝 Debug Info:');
    console.log('Token Address (approve called on this):', data.tokenAddress);
    console.log('TSender Address (spender):', tsenderAddress);
    console.log('Wallet Address (from):', walletAddress);
    console.log('Total Amount In Wei:', total.toString());

    try {
      const approvedAmount = await getApprovedAmount(
        data.tokenAddress,
        tsenderAddress,
      );

      if (approvedAmount < total) {
        console.log(
          `Approval needed: Current ${approvedAmount}, Required ${total}`,
        );

        const approvalHash = await approveWriteAsync({
          address: data.tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [tsenderAddress, total],
        });

        console.log('Approval tx hash:', approvalHash);

        const approvalReceipt = await waitForTransactionReceipt(config, {
          hash: approvalHash,
        });

        if (approvalReceipt.status !== 'success') {
          console.error('Approval tx failed:', approvalReceipt);
          toast.error('Approval transaction failed.');
          return;
        }

        console.log('Approval confirmed:', approvalReceipt);
      } else {
        console.log('✅ Sufficient allowance. Skipping approve.');
      }

      // Proceed with the airdrop
      const recipientAddresses = data.recipients
        .split(/,|\n/)
        .map((s) => s.trim())
        .filter(Boolean);

      const amounts = data.amounts
        .split(/,|\n/)
        .map((a) => BigInt(a.trim()))
        .filter(Boolean);

      if (recipientAddresses.length !== amounts.length) {
        toast.error('Number of recipients and amounts do not match.');
        return;
      }

      const airdropHash = await sendWriteAsync({
        address: tsenderAddress as `0x${string}`,
        abi: tsenderAbi,
        functionName: 'airdropERC20',
        args: [data.tokenAddress, recipientAddresses, amounts, total],
      });
      console.log('Airdrop tx hash:', airdropHash);

      const airdropReceipt = await waitForTransactionReceipt(config, {
        hash: airdropHash,
      });
      if (airdropReceipt.status !== 'success') {
        console.error('Airdrop tx failed:', airdropReceipt);
        toast.error('Airdrop transaction failed.');
        return;
      }
      console.log('Airdrop confirmed:', airdropReceipt);
      toast.success('Airdrop successful!');
    } catch (err) {
      console.error('Transaction error:', err);
      toast.error('Transaction failed. See console for details.');
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-8 mx-auto">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Token Airdrop Sender
        </h1>
        <p className="italic text-left hidden text-zinc-500 md:block">
          The most gas efficient airdrop contract on earth, built in huff 🐎
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="tokenAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-600">Token Address</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="0x..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipients"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-600">Recipients</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="0x123..., 0x456... (comma or newline separated)"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amounts"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-600">Amounts (wei)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="100, 200, 300... (comma or newline separated)"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg border p-4 bg-muted space-y-2">
            <h2 className="text-sm font-medium text-zinc-600">
              Transaction Details
            </h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">Amount (wei):</span>
              <span className="font-mono text-right">
                {totalAmountInWei.toString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">Amount (tokens):</span>
              <span className="font-mono text-right">
                {totalTokens.toFixed(4)}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isApproving || isSending}
          >
            {isApproving && 'Approving...'}
            {isSending && 'Sending...'}
            {!isApproving && !isSending && 'Send Tokens'}
          </Button>

          {approveError && (
            <p className="text-red-500 text-sm">{approveError.message}</p>
          )}
          {sendError && (
            <p className="text-red-500 text-sm">{sendError.message}</p>
          )}
        </form>
      </Form>
    </div>
  );
}

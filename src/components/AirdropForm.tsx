/* eslint-disable no-console */
'use client';

import { useMemo } from 'react';
import { chainsToTSender, erc20Abi, tsenderAbi } from '@/constans';
import { zodResolver } from '@hookform/resolvers/zod';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useAccount, useChainId, useConfig, useWriteContract } from 'wagmi';
import { z } from 'zod';

import {
  calculateAmountList,
  calculateTotalTokens,
  calculateTotalWei,
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

const FormSchema = z.object({
  tokenAddress: z.string().min(2, { message: 'Token address is required.' }),
  recipients: z
    .string()
    .min(1, { message: 'At least one recipient is required.' }),
  amounts: z.string().min(1, { message: 'At least one amount is required.' }),
});

type FormValues = z.infer<typeof FormSchema>;

export default function AirdropForm() {
  // 1. Get Required Data with Wagmi Hooks:
  const chainId = useChainId();
  const { address: ownerWalletAddress } = useAccount();
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
  const totalTokens: string = useMemo(
    () => calculateTotalTokens(totalAmountInWei, 18),
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

  // 2. Define Functions for Approval and Airdrop (Create the getApprovedAmount Helper Function)
  async function getApprovedAmount(
    erc20TokenAddress: string,
    spenderAddress: string,
  ) {
    console.log('🔍 Checking token allowance...');
    if (!erc20TokenAddress || !ownerWalletAddress) {
      toast.error('Please connect your wallet and enter a token address.');
      return BigInt(0);
    }
    console.log(
      '🔑 Owner Wallet Address (for approve & airdrop):',
      ownerWalletAddress,
    );
    console.log('🔑 Token Address (for allowance check):', erc20TokenAddress);
    console.log('🔑 Spender Address (TSender):', spenderAddress);

    // Read the current allowance from the ERC20 contract
    console.log('📖 Reading allowance from contract...');
    try {
      const allowance = await readContract(config, {
        abi: erc20Abi,
        address: erc20TokenAddress as `0x${string}`,
        functionName: 'allowance',
        args: [ownerWalletAddress, spenderAddress],
      });
      console.log('✅ readContract allowance response:', allowance);
      toast.success(`Allowance read successfully: ${allowance}`);
      return allowance as bigint;
    } catch (error) {
      console.error('❌ Error reading allowance:', error);
      toast.error('❌ Failed to read allowance. Please try again.');
      return BigInt(0);
    }
  }

  async function onSubmit(data: FormValues) {
    // Get the tsender contract address for the current chain
    const tsenderAddress = chainsToTSender[chainId]?.tsender;
    const total = totalAmountInWei;

    console.log('🟢🟢🟢 [Step 0] Form submission debug info:');
    console.log('🔗 Token Address:', data.tokenAddress);
    console.log('🔗 Current Chain ID:', chainId);
    console.log('🏹 TSender Address:', tsenderAddress);
    console.log('👛 Owner Wallet Address:', ownerWalletAddress);
    console.log('👥 Recipients:', data.recipients);
    console.log('💰 Total Amount In Wei:', total.toString());
    console.log('💸 Total Tokens:', totalTokens);

    //  1  Check the current token allowance: Read the amount the user (token owner) has already approved for our airdrop contract (spender).

    // 2 Request approval if needed: If the current allowance is less than the total amount required for the airdrop, prompt the user to execute an approve transaction.

    // 3 Execute the airdrop: Once sufficient allowance is confirmed, call the function on the airdrop contract to perform the token transfers.
    try {
      // 🟢 Step 1: Check approval
      console.log('🟢🟢🟢 [Step 1] Checking token allowance...');
      const approvedAmount = await getApprovedAmount(
        data.tokenAddress,
        tsenderAddress,
      );
      // TODO: Compare approvedAmount with the total amount needed for the airdrop
      // TODO: If allowance is insufficient, call the 'approve' function (approveWriteAsync/ approve function)
      // TODO: If allowance is sufficient, call the 'airdrop' function on tsender contract (sendWriteAsync /airdrop function)
      if (approvedAmount < total) {
        console.log(
          `🛑 [Step 1.1] Approval needed: Current ${approvedAmount}, Required ${total}`,
        );

        const approvalHash = await approveWriteAsync({
          address: data.tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [tsenderAddress, total],
          account: ownerWalletAddress,
          gas: BigInt(100_000), // ✅ manually set gas limit
        });
        console.log('🟢 Calling approve with:');
        console.log('💰 token:', data.tokenAddress);
        console.log('🏹 spender:', tsenderAddress);
        console.log('💰 amount:', total.toString());
        console.log('👛 account:', ownerWalletAddress);
        console.log('✅ [Step 1.2] Approval tx hash:', approvalHash);

        const approvalReceipt = await waitForTransactionReceipt(config, {
          hash: approvalHash,
        });

        if (approvalReceipt.status !== 'success') {
          console.error('❌ [Step 1.3] Approval tx failed:', approvalReceipt);
          toast.error('Approval transaction failed.');
          return;
        }

        console.log('🎉 [Step 1.3] Approval confirmed:', approvalReceipt);
      } else {
        console.log('✅ [Step 1] Sufficient allowance. Skipping approve.');
      }

      // 🟢 Step 2: Airdrop
      console.log('🚀🚀🚀 [Step 2] -- Sending airdrop transaction...');
      const recipientAddresses = data.recipients
        .split(/,|\n/)
        .map((s) => s.trim())
        .filter(Boolean);

      const amounts = data.amounts
        .split(/,|\n/)
        .map((a) => BigInt(a.trim()))
        .filter(Boolean);

      if (recipientAddresses.length !== amounts.length) {
        toast.error('❌ Number of recipients and amounts do not match.');
        return;
      }

      console.log('👥 Recipient Addresses:', recipientAddresses);
      console.log('💸 Amounts:', amounts);
      console.log('💰 Total Amount:', total);
      console.log('🔗 Token Address:', data.tokenAddress);
      console.log('🏹 TSender Address:', tsenderAddress);

      const airdropHash = await sendWriteAsync({
        address: tsenderAddress as `0x${string}`,
        abi: tsenderAbi,
        functionName: 'airdropERC20',
        args: [data.tokenAddress, recipientAddresses, amounts, total],
        account: ownerWalletAddress,
        gas: BigInt(300_000), // ✅ TEMP FIX to bypass gas estimation
      });

      console.log('✅ [Step 2.1] Airdrop tx hash:', airdropHash);
      console.log('⏳ [Step 2.2] Waiting for airdrop confirmation...');
      const airdropReceipt = await waitForTransactionReceipt(config, {
        hash: airdropHash,
      });

      if (airdropReceipt.status !== 'success') {
        console.error('❌ [Step 2.3] Airdrop tx failed:', airdropReceipt);
        toast.error('❌ Airdrop transaction failed.');
        return;
      } else {
        console.log('🎉 [Step 2.3] Airdrop confirmed:', airdropReceipt);
        console.log('✅ [Step 2] Airdrop successful!');
        toast.success(
          '✅ Airdrop transaction sent! Waiting for confirmation...',
        );
      }

      // 🟢 Step 3: Fetch recipient balance after airdrop
      console.log('🔎 [Step 3] Checking recipient balance...');
      for (const recipient of recipientAddresses) {
        const balance = await readContract(config, {
          abi: erc20Abi,
          address: data.tokenAddress as `0x${string}`,
          functionName: 'balanceOf',
          args: [recipient],
        });
        console.log(
          `💰 [Step 3.1] Recipient ${recipient} balance:`,
          (balance as bigint).toString(),
        );
        toast.success(
          `💰 Recipient ${recipient} balance: ${(balance as bigint).toString()}`,
        );
      }
      console.log('🎉 [Step 3] All recipient balances checked.');
      toast.success('Airdrop successful! ✅');
    } catch (err) {
      console.error('❌ [ERROR] Transaction failed:', err);
      toast.error('❌ Transaction failed. See console for details.');
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Token Airdrop Sender
        </h1>
        <p className="hidden text-left text-zinc-500 italic md:block">
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

          <div className="bg-muted space-y-2 rounded-lg border p-4">
            <h2 className="text-sm font-medium text-zinc-600">
              Transaction Details
            </h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">Amount (wei):</span>
              <span className="text-right font-mono">
                {totalAmountInWei.toString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">Amount (tokens):</span>
              <span className="text-right font-mono">{totalTokens}</span>
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
            <p className="text-sm text-red-500">{approveError.message}</p>
          )}
          {sendError && (
            <p className="text-sm text-red-500">{sendError.message}</p>
          )}
        </form>
      </Form>
    </div>
  );
}

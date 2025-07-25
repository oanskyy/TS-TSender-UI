/* eslint-disable no-console */
'use client';

import { JSX, useMemo, useState } from 'react';
import { chainsToTSender } from '@/constans';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { formatUnits } from 'viem';
import { useAccount, useChainId } from 'wagmi';
import { z } from 'zod';

import {
  calculateAmountList,
  calculateTotalTokens,
  calculateTotalWei,
} from '@/lib/calculateTotal';
import { parseBigIntList, parseList } from '@/lib/parseInput';
import { useAirdrop } from '@/hooks/useAirdrop';
import { useAllowance } from '@/hooks/useAllowance';
import { useApproveToken } from '@/hooks/useApproveToken';
import { useTokenInfo } from '@/hooks/useTokenInfo';
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
type RecipientBalance = {
  address: string;
  balance: bigint;
};

export default function AirdropForm(): JSX.Element {
  const [recipientBalances, setRecipientBalances] = useState<
    RecipientBalance[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Get Required Data with Wagmi Hooks:
  const chainId = useChainId();
  const { address: ownerWalletAddress, isConnected } = useAccount();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tokenAddress: '',
      recipients: '',
      amounts: '',
    },
  });

  const watchedAmounts: string = useWatch({
    control: form.control,
    name: 'amounts',
  });
  const watchedTokenAddress = useWatch({
    control: form.control,
    name: 'tokenAddress',
  });
  const [debouncedTokenAddress] = useDebounce(watchedTokenAddress, 500);
  const {
    data: tokenInfo,
    isLoading: loadingTokenInfo,
    isError: tokenInfoError,
  } = useTokenInfo(debouncedTokenAddress);
  // 2. Calculate Amounts and Totals
  // Use useMemo to optimize calculations
  // This prevents unnecessary recalculations on every render
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

  const { approveToken, isApproving, approveError } = useApproveToken();

  // Get the tsender contract address for the current chain
  const tsenderAddress = chainsToTSender[chainId]?.tsender;
  const { getAllowance } = useAllowance({
    token: form.watch('tokenAddress'),
    spender: tsenderAddress,
  });
  const { sendAirdrop, getBalances, isSending, sendError } = useAirdrop();
  const total = totalAmountInWei;

  async function onSubmit(data: FormValues): Promise<void> {
    setIsSubmitting(true); // 🔒 Lock form on submit
    console.log('🟢🟢🟢 [Step 0] Form submission debug info:');
    console.log('🔗 Token Address:', data.tokenAddress);
    console.log('🔗 Current Chain ID:', chainId);
    console.log('🏹 TSender Address:', tsenderAddress);
    console.log('👛 Owner Wallet Address:', ownerWalletAddress);
    console.log('👥 Recipients:', data.recipients);
    console.log('💰 Total Amount In Wei:', total.toString());
    console.log('💸 Total Tokens:', totalTokens);

    try {
      // 🟢 Step 1: check Allowance + Approve if needed
      console.log('🟢🟢🟢 [Step 1] Checking token allowance...');
      const approvedAmount = await getAllowance();

      if (approvedAmount < total) {
        console.log(
          `🛑 [Step 1.1] Approval needed: Current ${approvedAmount}, Required ${total}`,
        );

        const { txHash: approvalHash, receipt: approvalReceipt } =
          await approveToken({
            token: data.tokenAddress,
            spender: tsenderAddress,
            amount: total,
          });

        console.log('🟢 Calling approve with:');
        console.log('💰 token:', data.tokenAddress);
        console.log('🏹 spender:', tsenderAddress);
        console.log('💰 amount:', total.toString());
        console.log('👛 account:', ownerWalletAddress);
        console.log('✅ [Step 1.2] Approval tx hash:', approvalHash);

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
      toast.info('🚀 Sending airdrop transaction...');
      const recipientAddresses = parseList(data.recipients);
      const amounts = parseBigIntList(data.amounts);

      if (recipientAddresses.length !== amounts.length) {
        toast.error('❌ Number of recipients and amounts do not match.');
        return;
      }

      console.log('👥 Recipient Addresses:', recipientAddresses);
      console.log('💸 Amounts:', amounts);
      console.log('💰 Total Amount:', total);
      console.log('🔗 Token Address:', data.tokenAddress);
      console.log('🏹 TSender Address:', tsenderAddress);

      const { txHash: airdropHash, receipt: airdropReceipt } =
        await sendAirdrop({
          contract: tsenderAddress,
          token: data.tokenAddress,
          recipients: recipientAddresses,
          amounts,
          total,
        });
      console.log('✅ [Step 2.1] Airdrop tx hash:', airdropHash);
      console.log('⏳ [Step 2.2] Waiting for airdrop confirmation...');
      toast.info('⏳ Waiting for airdrop confirmation...');
      console.log('✅ [Step 2.3] Airdrop confirmed:', airdropReceipt);
      console.log('🎯 Reading recipient balances...');

      // 🟢 Step 3: Fetch recipient balance after airdrop
      const balances = await getBalances(data.tokenAddress, recipientAddresses);

      setRecipientBalances(
        recipientAddresses.map((addr, i) => ({
          address: addr,
          balance: balances[i],
        })),
      );

      balances.forEach((balance, i) => {
        console.log(
          `🟢 [Step 3] Recipient ${recipientAddresses[i]} balance: ${balance.toString()}`,
        );
        toast.success(
          `💰 Recipient ${recipientAddresses[i]}: ${balance.toString()}`,
        );
      });
    } catch (err) {
      console.error('❌ [ERROR] Transaction failed:', err);
      toast.error('❌ Transaction failed. See console for details.');
    } finally {
      setIsSubmitting(false); // 🔓 Always unlock form
      form.reset();
      toast.success('Airdrop successful! ✅');
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

      {!isConnected ? (
        <p className="text-md rounded-md border border-yellow-300 bg-yellow-100 p-5 text-center text-yellow-700">
          ⚠️ Please connect your wallet to access the airdrop form.
        </p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <fieldset
              disabled={isSubmitting}
              className="space-y-6 opacity-100 disabled:cursor-not-allowed"
            >
              <FormField
                control={form.control}
                name="tokenAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-600">
                      Token Address
                    </FormLabel>
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
                    <FormLabel className="text-zinc-600">
                      Amounts (wei)
                    </FormLabel>
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
            </fieldset>

            <div className="bg-muted space-y-2 rounded-lg border p-4">
              <h2 className="text-md font-semibold text-zinc-600">
                Transaction Details
              </h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Token Name:</span>
                <span className="text-right font-mono">
                  {loadingTokenInfo
                    ? 'Loading...'
                    : tokenInfo?.name ||
                      (tokenInfoError ? 'Invalid Token' : '—')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Symbol:</span>
                <span className="text-right font-mono">
                  {tokenInfo?.symbol || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Decimals:</span>
                <span className="text-right font-mono">
                  {tokenInfo?.decimals ?? '—'}
                </span>
              </div>
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
              className="w-full p-4 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isApproving || isSending || isSubmitting}
            >
              {isApproving && 'Approving spending allowance...'}
              {isSending && 'Sending...'}
              {!isApproving && !isSending && 'Send Tokens'}
            </Button>

            {approveError && (
              <p className="text-sm text-red-500">{approveError.message}</p>
            )}
            {sendError && (
              <p className="text-sm text-red-500">{sendError.message}</p>
            )}

            {recipientBalances.length > 0 && (
              <div className="space-y-2 rounded-md border border-green-200 bg-green-50 p-4 text-base text-green-700">
                <p className="font-medium">✅ Post-Airdrop Balances:</p>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-green-300">
                      <th className="px-2 py-1 font-semibold text-green-700">
                        Recipient
                      </th>
                      <th className="px-2 py-1 font-semibold text-green-700">
                        Amount ({tokenInfo?.symbol ?? 'tokens'})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipientBalances.map(({ address, balance }) => (
                      <tr key={address} className="border-b border-green-100">
                        <td className="px-2 py-1 font-mono break-all">
                          {address}
                        </td>
                        <td className="px-2 py-1">
                          {formatUnits(balance, tokenInfo?.decimals ?? 18)}
                          {/* {balance.toString()} */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </form>
        </Form>
      )}
    </div>
  );
}

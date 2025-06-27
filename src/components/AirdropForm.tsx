'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
// Define the form schema using zod
// This schema will validate the form inputs
// tokenAddress must be a string with at least 2 characters
// recipients must be a string with at least 1 character
// amounts must be a string with at least 1 character
// The messages will be shown if the user tries to submit without filling in the required fields
// The form will use this schema to validate the inputs before submission

export default function AirdropForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tokenAddress: '',
      recipients: '',
      amounts: '',
    },
  });
  // Initialize the form with default values and validation schema
  // Use react-hook-form with zod for validation
  // This will handle form state, validation, and submission
  // The form will have three fields: tokenAddress, recipients, and amounts
  // Each field has its own validation rules defined in the FormSchema
  // The form will show error messages if the user tries to submit without filling in the required fields
  // You can customize the default values as needed
  // For example, you can set a default token address or some sample recipients and amounts
  // This is useful for testing or providing a starting point for the user

  const watchedAmounts = useWatch({ control: form.control, name: 'amounts' });
  // Watch the amounts field to calculate total tokens
  // This will update automatically as the user types
  // or changes the amounts input

  const amountList = watchedAmounts
    ?.split(/[\n,]+/)
    .map((a) => a.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !isNaN(n));
  // Split by newline or comma, trim whitespace, filter out empty strings,
  // convert to numbers, and filter out NaN values

  const totalWei = amountList?.reduce((acc, cur) => acc + cur, 0) || 0;
  const totalTokens = totalWei / 1e18;

  function onSubmit(data: FormValues) {
    toast('Submitted values:', {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  // Handle form submission, you can replace this with your actual submission logic
  // For now, it just shows a toast with the submitted values
  // You can also add your airdrop logic here, e.g., calling a smart contract
  // or sending a transaction to the blockchain
  // Make sure to handle errors and edge cases in a real application
  // For example, check if the token address is valid, if the amounts match the recipients, etc.
  // You might also want to add loading states, error handling, and success messages
  // This is a simple example to get you started
  // You can customize the toast appearance and behavior as needed
  // Consider using a library like wagmi or ethers.js for interacting with the blockchain

  return (
    <div className="w-full max-w-2xl space-y-8 mx-auto">
      {/* Title */}
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
          {/* Token Address */}
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

          {/* Recipients */}
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

          {/* Amounts */}
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

          {/* ⬆️ Transaction Details - Moved Above Submit Button */}
          <div className="rounded-lg border p-4 bg-muted space-y-2">
            <h2 className="text-sm font-medium text-zinc-600">
              Transaction Details
            </h2>

            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">Token Name:</span>
              <span className="font-mono text-right">—</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">Amount (wei):</span>
              <span className="font-mono text-right">{totalWei}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600">Amount (tokens):</span>
              <span className="font-mono text-right">
                {totalTokens.toFixed(4)}
              </span>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Send Tokens
          </Button>
        </form>
      </Form>
    </div>
  );
}

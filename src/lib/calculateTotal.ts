import { formatUnits } from 'viem';

export function calculateAmountList(
  amounts: string | undefined | null,
): bigint[] {
  if (!amounts) return [];
  return amounts
    .split(/[\n,]+/)
    .map((amount) => amount.trim())
    .filter(Boolean)
    .map((amount) => {
      try {
        return BigInt(amount);
      } catch {
        return BigInt(0);
      }
    });
}

export function calculateTotalWei(amountList: bigint[]): bigint {
  return amountList.reduce((acc, cur) => acc + BigInt(cur), BigInt(0));
}

export function calculateTotalTokens(totalWei: bigint, decimals = 18): string {
  return formatUnits(totalWei, decimals);
}

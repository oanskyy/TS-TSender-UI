export function calculateAmountList(
  amounts: string | undefined | null,
): number[] {
  if (!amounts) return [];
  return amounts
    .split(/[\n,]+/)
    .map((a) => a.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !isNaN(n));
}

export function calculateTotalWei(amountList: number[]): number {
  return amountList.reduce((acc, cur) => acc + cur, 0);
}

export function calculateTotalTokens(totalWei: number, decimals = 18): number {
  return totalWei / 10 ** decimals;
}

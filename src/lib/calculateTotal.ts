export function calculateAmountList(
  amounts: string | undefined | null,
): number[] {
  if (!amounts) return [];
  return amounts
    .split(/[\n,]+/)
    .map((amount) => amount.trim())
    .filter(Boolean)
    .map(Number)
    .filter((nonnumeric) => !isNaN(nonnumeric));
}

export function calculateTotalWei(amountList: number[]): number {
  return amountList.reduce((acc, cur) => acc + cur, 0);
}

export function calculateTotalTokens(totalWei: number, decimals = 18): number {
  return totalWei / 10 ** decimals;
}

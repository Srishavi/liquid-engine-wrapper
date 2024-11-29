export function moneyFilter(value: any) {
    const amount = parseFloat(value);
    if (isNaN(amount)) return value;
    return `$${amount.toFixed(2)}`;
  }
  
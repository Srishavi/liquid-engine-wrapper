function moneyFilter(value: number | string): string {
    const amount = parseFloat(value.toString());
    if (isNaN(amount)) return value.toString();
    return `$${amount.toFixed(2)}`;
  }
  
  export default moneyFilter;
  
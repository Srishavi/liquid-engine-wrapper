function moneyFilter(value) {
  const amount = parseFloat(value);
  if (isNaN(amount)) return value;
  return `$${amount.toFixed(2)}`;
}

module.exports = moneyFilter;
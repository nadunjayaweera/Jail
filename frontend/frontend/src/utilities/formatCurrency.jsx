import intl from 'intl';

const CURRENCY_FORMATTER = new intl.NumberFormat('RS', {
  style: 'currency',
});

export function formatCurrency(number) {
  return CURRENCY_FORMATTER.format(number);
}

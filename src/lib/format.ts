export function formatEuro(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function formatDatum(value: Date) {
  return new Intl.DateTimeFormat("de-DE").format(value);
}

export function berechnePnl(trade: {
  richtung: string;
  menge: number;
  einstiegspreis: number;
  ausstiegspreis: number | null;
}) {
  if (trade.ausstiegspreis === null) {
    return null;
  }
  const diff =
    trade.richtung === "buy"
      ? trade.ausstiegspreis - trade.einstiegspreis
      : trade.einstiegspreis - trade.ausstiegspreis;
  return diff * trade.menge;
}

export function getStartkapital() {
  const raw = process.env.PAPER_TRADING_STARTKAPITAL;
  const value = raw ? Number(raw) : NaN;
  return Number.isFinite(value) ? value : 10000;
}

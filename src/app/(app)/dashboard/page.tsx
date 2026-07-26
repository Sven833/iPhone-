import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatEuro } from "@/lib/format";
import { berechnePnl, getStartkapital } from "@/lib/trading";

export default async function DashboardPage() {
  const [kundenCount, angeboteCount, offeneSignaleCount, trades] =
    await Promise.all([
      prisma.kunde.count(),
      prisma.angebot.count(),
      prisma.signal.count({ where: { status: "offen" } }),
      prisma.trade.findMany(),
    ]);

  const offeneTradesCount = trades.filter((t) => t.status === "offen").length;
  const realisierterPnl = trades.reduce(
    (sum, trade) => sum + (berechnePnl(trade) ?? 0),
    0
  );
  const kontostand = getStartkapital() + realisierterPnl;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Übersicht</h1>
      <p className="mt-1 text-sm text-slate-500">
        Willkommen im internen Firmen-Tool.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/kunden"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-orange-300"
        >
          <p className="text-sm text-slate-500">Kunden</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {kundenCount}
          </p>
        </Link>

        <Link
          href="/angebote"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-orange-300"
        >
          <p className="text-sm text-slate-500">Angebote</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {angeboteCount}
          </p>
        </Link>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">
        Trading (Paper)
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Kontostand (virtuell)</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {formatEuro(kontostand)}
          </p>
        </div>

        <Link
          href="/signale"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-orange-300"
        >
          <p className="text-sm text-slate-500">Offene Signale</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {offeneSignaleCount}
          </p>
        </Link>

        <Link
          href="/trades"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-orange-300"
        >
          <p className="text-sm text-slate-500">Offene Trades</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {offeneTradesCount}
          </p>
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
        Weitere Module wie Aufmaß und Zeiterfassung können hier Schritt für
        Schritt ergänzt werden.
      </div>
    </div>
  );
}

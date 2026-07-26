import { prisma } from "@/lib/prisma";
import { formatEuro, formatDatum } from "@/lib/format";
import { berechnePnl } from "@/lib/trading";
import { closeTrade } from "../signale/actions";

export default async function TradesPage() {
  const trades = await prisma.trade.findMany({ orderBy: { createdAt: "desc" } });
  const offene = trades.filter((trade) => trade.status === "offen");
  const geschlossene = trades.filter((trade) => trade.status === "geschlossen");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Trades (Paper Trading)
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Virtuelle Positionen aus bestätigten Signalen – kein echtes Geld.
      </p>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Offene Positionen
        </h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {offene.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              Keine offenen Positionen.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Symbol</th>
                  <th className="px-4 py-3 font-medium">Richtung</th>
                  <th className="px-4 py-3 font-medium">Menge</th>
                  <th className="px-4 py-3 font-medium">Einstieg</th>
                  <th className="px-4 py-3 font-medium">Eröffnet</th>
                  <th className="px-4 py-3 font-medium">Schließen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offene.map((trade) => (
                  <tr key={trade.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {trade.symbol}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          trade.richtung === "buy"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {trade.richtung === "buy" ? "Buy" : "Sell"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{trade.menge}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {trade.einstiegspreis}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDatum(trade.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <form
                        action={closeTrade.bind(null, trade.id)}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="number"
                          step="0.00001"
                          name="ausstiegspreis"
                          placeholder="Schlusskurs"
                          required
                          className="w-28 rounded-md border border-slate-300 px-2 py-1 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <button
                          type="submit"
                          className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"
                        >
                          Schließen
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">
          Geschlossene Positionen
        </h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {geschlossene.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              Noch keine geschlossenen Positionen.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Symbol</th>
                  <th className="px-4 py-3 font-medium">Richtung</th>
                  <th className="px-4 py-3 font-medium">Einstieg</th>
                  <th className="px-4 py-3 font-medium">Ausstieg</th>
                  <th className="px-4 py-3 font-medium">P&amp;L</th>
                  <th className="px-4 py-3 font-medium">Geschlossen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {geschlossene.map((trade) => {
                  const pnl = berechnePnl(trade);
                  return (
                    <tr key={trade.id}>
                      <td className="px-4 py-3 text-slate-900">
                        {trade.symbol}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {trade.richtung === "buy" ? "Buy" : "Sell"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {trade.einstiegspreis}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {trade.ausstiegspreis}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${
                          pnl !== null && pnl >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {pnl !== null ? formatEuro(pnl) : "–"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {trade.geschlossenAt
                          ? formatDatum(trade.geschlossenAt)
                          : "–"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { formatDatum } from "@/lib/format";
import { PushBenachrichtigungen } from "@/components/push-benachrichtigungen";
import { confirmSignal, ignoreSignal } from "./actions";

const STATUS_LABELS: Record<string, string> = {
  offen: "Offen",
  bestaetigt_buy: "Buy bestätigt",
  bestaetigt_sell: "Sell bestätigt",
  ignoriert: "Ignoriert",
};

export default async function SignalePage() {
  const [offeneSignale, verarbeiteteSignale] = await Promise.all([
    prisma.signal.findMany({
      where: { status: "offen" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.signal.findMany({
      where: { status: { not: "offen" } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const webhookSecret = process.env.TRADINGVIEW_WEBHOOK_SECRET;
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Signale</h1>
          <p className="mt-1 text-sm text-slate-500">
            Eingehende TradingView-Signale. Buy/Sell eröffnet eine virtuelle
            Paper-Trading-Position (kein echtes Geld).
          </p>
        </div>
        <PushBenachrichtigungen vapidPublicKey={vapidPublicKey} />
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
        <p className="font-medium text-slate-900">
          TradingView-Alert einrichten
        </p>
        <p className="mt-1">
          Webhook-URL (in TradingView beim Alert unter &bdquo;Benachrichtigungen
          &rdquo; → &bdquo;Webhook-URL&rdquo; eintragen):
        </p>
        <code className="mt-1 block overflow-x-auto rounded bg-slate-100 px-3 py-2 text-xs">
          https://DEINE-DOMAIN/api/webhooks/tradingview
        </code>
        <p className="mt-3">Nachricht (JSON) im Alert:</p>
        <pre className="mt-1 overflow-x-auto rounded bg-slate-100 px-3 py-2 text-xs">
{`{
  "secret": "${webhookSecret ?? "NICHT KONFIGURIERT – siehe .env"}",
  "symbol": "{{ticker}}",
  "richtung": "buy",
  "preis": {{close}}
}`}
        </pre>
        <p className="mt-2 text-xs text-slate-500">
          Für Verkaufssignale einen zweiten Alert mit &bdquo;richtung&rdquo;:
          &bdquo;sell&rdquo; anlegen.
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Offene Signale
        </h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {offeneSignale.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              Keine offenen Signale.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Symbol</th>
                  <th className="px-4 py-3 font-medium">Signal</th>
                  <th className="px-4 py-3 font-medium">Preis</th>
                  <th className="px-4 py-3 font-medium">Quelle</th>
                  <th className="px-4 py-3 font-medium">Zeit</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offeneSignale.map((signal) => (
                  <tr key={signal.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {signal.symbol}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          signal.richtung === "buy"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {signal.richtung === "buy" ? "Buy-Signal" : "Sell-Signal"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {signal.preis ?? "–"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {signal.quelle ?? "–"}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDatum(signal.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <form action={confirmSignal.bind(null, signal.id, "buy")}>
                          <button
                            type="submit"
                            className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                          >
                            Buy
                          </button>
                        </form>
                        <form
                          action={confirmSignal.bind(null, signal.id, "sell")}
                        >
                          <button
                            type="submit"
                            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                          >
                            Sell
                          </button>
                        </form>
                        <form action={ignoreSignal.bind(null, signal.id)}>
                          <button
                            type="submit"
                            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
                          >
                            Ignorieren
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Verlauf</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {verarbeiteteSignale.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              Noch keine verarbeiteten Signale.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Symbol</th>
                  <th className="px-4 py-3 font-medium">Signal</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Zeit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {verarbeiteteSignale.map((signal) => (
                  <tr key={signal.id}>
                    <td className="px-4 py-3 text-slate-900">
                      {signal.symbol}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {signal.richtung === "buy" ? "Buy" : "Sell"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {STATUS_LABELS[signal.status] ?? signal.status}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDatum(signal.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

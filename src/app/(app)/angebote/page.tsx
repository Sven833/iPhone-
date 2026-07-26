import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatEuro, formatDatum } from "@/lib/format";

const STATUS_LABELS: Record<string, string> = {
  entwurf: "Entwurf",
  versendet: "Versendet",
  angenommen: "Angenommen",
  abgelehnt: "Abgelehnt",
};

const STATUS_STYLES: Record<string, string> = {
  entwurf: "bg-slate-100 text-slate-600",
  versendet: "bg-blue-100 text-blue-700",
  angenommen: "bg-green-100 text-green-700",
  abgelehnt: "bg-red-100 text-red-700",
};

export default async function AngebotePage() {
  const angebote = await prisma.angebot.findMany({
    include: { kunde: true, positionen: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Angebote</h1>
        <Link
          href="/angebote/neu"
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
        >
          + Neues Angebot
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {angebote.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            Noch keine Angebote erstellt.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nr.</th>
                <th className="px-4 py-3 font-medium">Titel</th>
                <th className="px-4 py-3 font-medium">Kunde</th>
                <th className="px-4 py-3 font-medium">Summe</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {angebote.map((angebot) => {
                const summe = angebot.positionen.reduce(
                  (sum, p) => sum + p.menge * p.einzelpreis,
                  0
                );
                return (
                  <tr key={angebot.id}>
                    <td className="px-4 py-3 text-slate-500">
                      #{angebot.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link
                        href={`/angebote/${angebot.id}`}
                        className="hover:text-orange-600"
                      >
                        {angebot.titel}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {angebot.kunde.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatEuro(summe)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          STATUS_STYLES[angebot.status] ??
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {STATUS_LABELS[angebot.status] ?? angebot.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDatum(angebot.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

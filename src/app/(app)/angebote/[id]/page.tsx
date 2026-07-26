import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AngebotForm } from "@/components/angebot-form";
import { formatEuro } from "@/lib/format";
import { updateAngebot, deleteAngebot, updateAngebotStatus } from "../actions";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "entwurf", label: "Entwurf" },
  { value: "versendet", label: "Versendet" },
  { value: "angenommen", label: "Angenommen" },
  { value: "abgelehnt", label: "Abgelehnt" },
];

export default async function AngebotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const angebotId = Number(id);

  if (!Number.isInteger(angebotId)) {
    notFound();
  }

  const [angebot, kunden] = await Promise.all([
    prisma.angebot.findUnique({
      where: { id: angebotId },
      include: { kunde: true, positionen: { orderBy: { reihenfolge: "asc" } } },
    }),
    prisma.kunde.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!angebot) {
    notFound();
  }

  const summe = angebot.positionen.reduce(
    (sum, p) => sum + p.menge * p.einzelpreis,
    0
  );

  return (
    <div>
      <Link
        href="/angebote"
        className="text-sm text-slate-500 hover:text-orange-600"
      >
        ← Zurück zu Angeboten
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Angebot #{angebot.id}
          </h1>
          <p className="text-sm text-slate-500">
            {angebot.kunde.name} · {formatEuro(summe)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {STATUS_OPTIONS.map((option) => (
            <form
              key={option.value}
              action={updateAngebotStatus.bind(null, angebot.id, option.value)}
            >
              <button
                type="submit"
                disabled={angebot.status === option.value}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  angebot.status === option.value
                    ? "bg-orange-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {option.label}
              </button>
            </form>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <AngebotForm
          action={updateAngebot.bind(null, angebot.id)}
          kunden={kunden}
          submitLabel="Änderungen speichern"
          angebot={{
            titel: angebot.titel,
            kundeId: angebot.kundeId,
            notizen: angebot.notizen,
            positionen: angebot.positionen.map((p) => ({
              beschreibung: p.beschreibung,
              menge: p.menge,
              einheit: p.einheit,
              einzelpreis: p.einzelpreis,
            })),
          }}
        />
      </div>

      <form action={deleteAngebot.bind(null, angebot.id)} className="mt-4">
        <button
          type="submit"
          className="text-sm text-red-600 hover:text-red-700"
        >
          Angebot löschen
        </button>
      </form>
    </div>
  );
}

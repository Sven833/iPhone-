import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { KundenForm } from "@/components/kunden-form";
import { updateKunde, deleteKunde } from "../actions";

export default async function KundeBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kunde = await prisma.kunde.findUnique({ where: { id } });

  if (!kunde) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/kunden"
        className="text-sm text-slate-500 hover:text-orange-600"
      >
        ← Zurück zu Kunden
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          {kunde.name} bearbeiten
        </h1>
        <form action={deleteKunde.bind(null, kunde.id)}>
          <button
            type="submit"
            className="text-sm text-red-600 hover:text-red-700"
          >
            Kunde löschen
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <KundenForm
          action={updateKunde.bind(null, kunde.id)}
          kunde={kunde}
          submitLabel="Änderungen speichern"
        />
      </div>
    </div>
  );
}

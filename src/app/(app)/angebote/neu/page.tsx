import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AngebotForm } from "@/components/angebot-form";
import { createAngebot } from "../actions";

export default async function NeuesAngebotPage() {
  const kunden = await prisma.kunde.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <Link
        href="/angebote"
        className="text-sm text-slate-500 hover:text-orange-600"
      >
        ← Zurück zu Angeboten
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
        Neues Angebot
      </h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <AngebotForm
          action={createAngebot}
          kunden={kunden}
          submitLabel="Angebot erstellen"
        />
      </div>
    </div>
  );
}

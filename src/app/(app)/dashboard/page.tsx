import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const kundenCount = await prisma.kunde.count();

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
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
        Weitere Module wie Angebote/Aufmaß und Zeiterfassung können hier
        Schritt für Schritt ergänzt werden.
      </div>
    </div>
  );
}

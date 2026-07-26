import Link from "next/link";
import { KundenForm } from "@/components/kunden-form";
import { createKunde } from "../actions";

export default function NeuerKundePage() {
  return (
    <div>
      <Link
        href="/kunden"
        className="text-sm text-slate-500 hover:text-orange-600"
      >
        ← Zurück zu Kunden
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
        Neuer Kunde
      </h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <KundenForm action={createKunde} submitLabel="Kunde anlegen" />
      </div>
    </div>
  );
}

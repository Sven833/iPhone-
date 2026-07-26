import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteKunde } from "./actions";

export default async function KundenPage() {
  const kunden = await prisma.kunde.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Kunden</h1>
        <Link
          href="/kunden/neu"
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
        >
          + Neuer Kunde
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {kunden.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            Noch keine Kunden angelegt.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Telefon</th>
                <th className="px-4 py-3 font-medium">E-Mail</th>
                <th className="px-4 py-3 font-medium">Adresse</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kunden.map((kunde) => (
                <tr key={kunde.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link
                      href={`/kunden/${kunde.id}`}
                      className="hover:text-orange-600"
                    >
                      {kunde.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {kunde.telefon ?? "–"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {kunde.email ?? "–"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {kunde.adresse ?? "–"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/kunden/${kunde.id}`}
                        className="text-slate-500 hover:text-orange-600"
                      >
                        Bearbeiten
                      </Link>
                      <form action={deleteKunde.bind(null, kunde.id)}>
                        <button
                          type="submit"
                          className="text-slate-500 hover:text-red-600"
                        >
                          Löschen
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
  );
}

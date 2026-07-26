import Link from "next/link";
import { PositionenEditor, type PositionRow } from "./positionen-editor";

const inputClasses =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500";
const labelClasses = "block text-sm font-medium text-slate-700";

type KundeOption = { id: string; name: string };

export function AngebotForm({
  action,
  kunden,
  submitLabel,
  angebot,
}: {
  action: (formData: FormData) => void | Promise<void>;
  kunden: KundeOption[];
  submitLabel: string;
  angebot?: {
    titel: string;
    kundeId: string;
    notizen: string | null;
    positionen: PositionRow[];
  };
}) {
  if (kunden.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Es gibt noch keine Kunden.{" "}
        <Link href="/kunden/neu" className="text-orange-600 hover:underline">
          Zuerst einen Kunden anlegen
        </Link>
        .
      </p>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="kundeId" className={labelClasses}>
            Kunde *
          </label>
          <select
            id="kundeId"
            name="kundeId"
            required
            defaultValue={angebot?.kundeId ?? ""}
            className={inputClasses}
          >
            <option value="" disabled>
              Kunde auswählen
            </option>
            {kunden.map((kunde) => (
              <option key={kunde.id} value={kunde.id}>
                {kunde.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="titel" className={labelClasses}>
            Titel *
          </label>
          <input
            id="titel"
            name="titel"
            required
            defaultValue={angebot?.titel}
            placeholder="z.B. Fassadenanstrich Musterstraße 1"
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Positionen</label>
        <PositionenEditor initial={angebot?.positionen} />
      </div>

      <div>
        <label htmlFor="notizen" className={labelClasses}>
          Notizen
        </label>
        <textarea
          id="notizen"
          name="notizen"
          rows={3}
          defaultValue={angebot?.notizen ?? ""}
          className={inputClasses}
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}

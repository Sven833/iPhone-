import type { Kunde } from "@/generated/prisma/client";

const inputClasses =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500";
const labelClasses = "block text-sm font-medium text-slate-700";

export function KundenForm({
  action,
  kunde,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  kunde?: Kunde;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-lg space-y-4">
      <div>
        <label htmlFor="name" className={labelClasses}>
          Name *
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={kunde?.name}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="telefon" className={labelClasses}>
          Telefon
        </label>
        <input
          id="telefon"
          name="telefon"
          defaultValue={kunde?.telefon ?? ""}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClasses}>
          E-Mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={kunde?.email ?? ""}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="adresse" className={labelClasses}>
          Adresse
        </label>
        <input
          id="adresse"
          name="adresse"
          defaultValue={kunde?.adresse ?? ""}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="notizen" className={labelClasses}>
          Notizen
        </label>
        <textarea
          id="notizen"
          name="notizen"
          rows={4}
          defaultValue={kunde?.notizen ?? ""}
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

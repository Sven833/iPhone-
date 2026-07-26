"use client";

import { useState } from "react";

export type PositionRow = {
  beschreibung: string;
  menge: number;
  einheit: string;
  einzelpreis: number;
};

const inputClasses =
  "rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500";

function emptyRow(): PositionRow {
  return { beschreibung: "", menge: 1, einheit: "Stk.", einzelpreis: 0 };
}

export function PositionenEditor({ initial }: { initial?: PositionRow[] }) {
  const [rows, setRows] = useState<PositionRow[]>(
    initial && initial.length > 0 ? initial : [emptyRow()]
  );

  function updateRow(index: number, field: keyof PositionRow, value: string) {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]:
                field === "menge" || field === "einzelpreis"
                  ? Number(value)
                  : value,
            }
          : row
      )
    );
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function removeRow(index: number) {
    setRows((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  const summe = rows.reduce((sum, row) => sum + row.menge * row.einzelpreis, 0);

  return (
    <div className="mt-1 space-y-2">
      <input type="hidden" name="position_count" value={rows.length} />

      <div className="hidden gap-2 px-1 text-xs font-medium text-slate-500 sm:grid sm:grid-cols-12">
        <span className="sm:col-span-5">Beschreibung</span>
        <span className="sm:col-span-2">Menge</span>
        <span className="sm:col-span-2">Einheit</span>
        <span className="sm:col-span-2">Einzelpreis (€)</span>
      </div>

      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-12 gap-2">
          <input
            name={`position_beschreibung_${i}`}
            value={row.beschreibung}
            onChange={(e) => updateRow(i, "beschreibung", e.target.value)}
            placeholder="z.B. Wände streichen"
            className={`col-span-12 sm:col-span-5 ${inputClasses}`}
          />
          <input
            name={`position_menge_${i}`}
            type="number"
            step="0.01"
            min="0"
            value={row.menge}
            onChange={(e) => updateRow(i, "menge", e.target.value)}
            className={`col-span-4 sm:col-span-2 ${inputClasses}`}
          />
          <input
            name={`position_einheit_${i}`}
            value={row.einheit}
            onChange={(e) => updateRow(i, "einheit", e.target.value)}
            placeholder="m², Std., Stk."
            className={`col-span-4 sm:col-span-2 ${inputClasses}`}
          />
          <input
            name={`position_einzelpreis_${i}`}
            type="number"
            step="0.01"
            min="0"
            value={row.einzelpreis}
            onChange={(e) => updateRow(i, "einzelpreis", e.target.value)}
            className={`col-span-3 sm:col-span-2 ${inputClasses}`}
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="col-span-1 rounded-md border border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-600"
            aria-label="Position entfernen"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="text-sm font-medium text-orange-600 hover:text-orange-700"
      >
        + Position hinzufügen
      </button>

      <p className="pt-2 text-right text-sm font-semibold text-slate-900">
        Summe:{" "}
        {new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
        }).format(summe)}
      </p>
    </div>
  );
}

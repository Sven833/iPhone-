import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushToAll } from "@/lib/push";

export async function POST(request: Request) {
  const secret = process.env.TRADINGVIEW_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "TRADINGVIEW_WEBHOOK_SECRET ist nicht konfiguriert." },
      { status: 500 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültiges JSON." }, { status: 400 });
  }

  if (payload.secret !== secret) {
    return NextResponse.json({ error: "Ungültiges Secret." }, { status: 401 });
  }

  const symbol =
    typeof payload.symbol === "string" ? payload.symbol.trim() : "";
  const richtungRaw =
    typeof payload.richtung === "string"
      ? payload.richtung.trim().toLowerCase()
      : "";
  const richtung =
    richtungRaw === "sell" ? "sell" : richtungRaw === "buy" ? "buy" : null;

  if (!symbol || !richtung) {
    return NextResponse.json(
      { error: "Felder 'symbol' und 'richtung' (buy/sell) sind erforderlich." },
      { status: 400 }
    );
  }

  const preisRaw = payload.preis;
  const preis =
    typeof preisRaw === "number"
      ? preisRaw
      : typeof preisRaw === "string" && preisRaw.trim() !== ""
        ? Number(preisRaw)
        : null;
  const quelle = typeof payload.quelle === "string" ? payload.quelle : null;

  const signal = await prisma.signal.create({
    data: {
      symbol,
      richtung,
      preis: preis !== null && !Number.isNaN(preis) ? preis : null,
      quelle,
      rohdaten: JSON.stringify(payload),
    },
  });

  const richtungLabel = richtung === "buy" ? "Buy" : "Sell";
  await sendPushToAll({
    title: `${richtungLabel}-Signal: ${symbol}`,
    body: signal.preis
      ? `Kurs: ${signal.preis}${quelle ? ` · ${quelle}` : ""}`
      : quelle ?? "Neues Signal eingegangen",
    url: "/signale",
  });

  return NextResponse.json({ ok: true, id: signal.id });
}

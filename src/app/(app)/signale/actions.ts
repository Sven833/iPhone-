"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const DEFAULT_MENGE = 1;

export async function confirmSignal(id: string, richtung: "buy" | "sell") {
  const signal = await prisma.signal.findUnique({ where: { id } });
  if (!signal || signal.status !== "offen") {
    return;
  }

  const einstiegspreis = signal.preis ?? 0;

  await prisma.$transaction([
    prisma.trade.create({
      data: {
        symbol: signal.symbol,
        richtung,
        menge: DEFAULT_MENGE,
        einstiegspreis,
        signalId: signal.id,
      },
    }),
    prisma.signal.update({
      where: { id },
      data: {
        status: richtung === "buy" ? "bestaetigt_buy" : "bestaetigt_sell",
      },
    }),
  ]);

  revalidatePath("/signale");
  revalidatePath("/trades");
  revalidatePath("/dashboard");
}

export async function ignoreSignal(id: string) {
  await prisma.signal.update({
    where: { id },
    data: { status: "ignoriert" },
  });
  revalidatePath("/signale");
}

export async function closeTrade(id: string, formData: FormData) {
  const ausstiegspreisRaw = formData.get("ausstiegspreis");
  const ausstiegspreis = Number(ausstiegspreisRaw);

  if (!ausstiegspreisRaw || Number.isNaN(ausstiegspreis)) {
    throw new Error("Bitte einen gültigen Schlusskurs angeben.");
  }

  await prisma.trade.update({
    where: { id },
    data: {
      ausstiegspreis,
      status: "geschlossen",
      geschlossenAt: new Date(),
    },
  });

  revalidatePath("/trades");
  revalidatePath("/dashboard");
}

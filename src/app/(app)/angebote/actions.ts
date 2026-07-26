"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function parsePositionen(formData: FormData) {
  const count = Number(formData.get("position_count") ?? 0);
  const positionen = [];

  for (let i = 0; i < count; i++) {
    const beschreibung = (
      formData.get(`position_beschreibung_${i}`) as string | null
    )?.trim();
    if (!beschreibung) {
      continue;
    }

    const menge = Number(formData.get(`position_menge_${i}`) ?? 0);
    const einheit =
      (formData.get(`position_einheit_${i}`) as string | null)?.trim() ||
      "Stk.";
    const einzelpreis = Number(formData.get(`position_einzelpreis_${i}`) ?? 0);

    positionen.push({
      beschreibung,
      menge,
      einheit,
      einzelpreis,
      reihenfolge: i,
    });
  }

  return positionen;
}

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Feld "${key}" ist erforderlich.`);
  }
  return value.trim();
}

export async function createAngebot(formData: FormData) {
  const titel = getRequiredString(formData, "titel");
  const kundeId = getRequiredString(formData, "kundeId");
  const notizen =
    (formData.get("notizen") as string | null)?.trim() || null;
  const positionen = parsePositionen(formData);

  const angebot = await prisma.angebot.create({
    data: {
      titel,
      kundeId,
      notizen,
      positionen: { create: positionen },
    },
  });

  revalidatePath("/angebote");
  redirect(`/angebote/${angebot.id}`);
}

export async function updateAngebot(id: number, formData: FormData) {
  const titel = getRequiredString(formData, "titel");
  const kundeId = getRequiredString(formData, "kundeId");
  const notizen =
    (formData.get("notizen") as string | null)?.trim() || null;
  const positionen = parsePositionen(formData);

  await prisma.$transaction([
    prisma.angebotPosition.deleteMany({ where: { angebotId: id } }),
    prisma.angebot.update({
      where: { id },
      data: {
        titel,
        kundeId,
        notizen,
        positionen: { create: positionen },
      },
    }),
  ]);

  revalidatePath("/angebote");
  revalidatePath(`/angebote/${id}`);
  redirect(`/angebote/${id}`);
}

export async function updateAngebotStatus(id: number, status: string) {
  await prisma.angebot.update({ where: { id }, data: { status } });
  revalidatePath("/angebote");
  revalidatePath(`/angebote/${id}`);
}

export async function deleteAngebot(id: number) {
  await prisma.angebot.delete({ where: { id } });
  revalidatePath("/angebote");
  redirect("/angebote");
}

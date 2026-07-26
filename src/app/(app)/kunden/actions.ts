"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function getStringOrNull(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Feld "${key}" ist erforderlich.`);
  }
  return value.trim();
}

export async function createKunde(formData: FormData) {
  const name = getRequiredString(formData, "name");

  await prisma.kunde.create({
    data: {
      name,
      telefon: getStringOrNull(formData, "telefon"),
      email: getStringOrNull(formData, "email"),
      adresse: getStringOrNull(formData, "adresse"),
      notizen: getStringOrNull(formData, "notizen"),
    },
  });

  revalidatePath("/kunden");
  redirect("/kunden");
}

export async function updateKunde(id: string, formData: FormData) {
  const name = getRequiredString(formData, "name");

  await prisma.kunde.update({
    where: { id },
    data: {
      name,
      telefon: getStringOrNull(formData, "telefon"),
      email: getStringOrNull(formData, "email"),
      adresse: getStringOrNull(formData, "adresse"),
      notizen: getStringOrNull(formData, "notizen"),
    },
  });

  revalidatePath("/kunden");
  redirect("/kunden");
}

export async function deleteKunde(id: string) {
  await prisma.kunde.delete({ where: { id } });
  revalidatePath("/kunden");
  redirect("/kunden");
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const endpoint = body?.endpoint;
  const p256dh = body?.keys?.p256dh;
  const authKey = body?.keys?.auth;

  if (
    typeof endpoint !== "string" ||
    typeof p256dh !== "string" ||
    typeof authKey !== "string"
  ) {
    return NextResponse.json(
      { error: "Ungültige Subscription." },
      { status: 400 }
    );
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { p256dh, auth: authKey },
    create: { endpoint, p256dh, auth: authKey },
  });

  return NextResponse.json({ ok: true });
}

import webpush from "web-push";
import { prisma } from "@/lib/prisma";

let configured = false;

function ensureConfigured() {
  if (configured) {
    return true;
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(
    "mailto:info@msb-malerbetrieb.de",
    publicKey,
    privateKey
  );
  configured = true;
  return true;
}

export async function sendPushToAll(payload: {
  title: string;
  body: string;
  url?: string;
}) {
  if (!ensureConfigured()) {
    return;
  }

  const subscriptions = await prisma.pushSubscription.findMany();
  if (subscriptions.length === 0) {
    return;
  }

  const data = JSON.stringify(payload);

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          data
        );
      } catch (error) {
        const statusCode =
          typeof error === "object" && error !== null && "statusCode" in error
            ? (error as { statusCode?: number }).statusCode
            : undefined;

        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.delete({
            where: { id: subscription.id },
          });
        }
      }
    })
  );
}

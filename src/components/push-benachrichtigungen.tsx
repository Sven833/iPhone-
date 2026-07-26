"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

type Status = "idle" | "subscribed" | "unsupported" | "denied";

export function PushBenachrichtigungen({
  vapidPublicKey,
}: {
  vapidPublicKey?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSupportAndSubscription() {
      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window)
      ) {
        if (!cancelled) {
          setStatus("unsupported");
        }
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const existing = await registration.pushManager.getSubscription();
      if (!cancelled && existing) {
        setStatus("subscribed");
      }
    }

    checkSupportAndSubscription();

    return () => {
      cancelled = true;
    };
  }, []);

  async function activate() {
    if (!vapidPublicKey) {
      alert("Push ist serverseitig nicht konfiguriert (VAPID-Keys fehlen).");
      return;
    }

    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      setStatus("subscribed");
    } finally {
      setLoading(false);
    }
  }

  if (status === "unsupported") {
    return (
      <p className="text-xs text-slate-500">
        Push-Benachrichtigungen werden von diesem Browser nicht unterstützt.
        Auf dem iPhone: Seite über Safari zum Home-Bildschirm hinzufügen und
        von dort öffnen (ab iOS 16.4).
      </p>
    );
  }

  if (status === "subscribed") {
    return (
      <p className="text-xs text-green-700">
        ✓ Push-Benachrichtigungen sind für dieses Gerät aktiviert.
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={activate}
        disabled={loading}
        className="rounded-md border border-orange-300 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-100 disabled:opacity-50"
      >
        {loading ? "Aktiviere…" : "Push-Benachrichtigungen aktivieren"}
      </button>
      {status === "denied" && (
        <p className="mt-1 text-xs text-red-600">
          Berechtigung wurde abgelehnt. Bitte in den
          Browser-/iPhone-Einstellungen für diese Seite erlauben.
        </p>
      )}
    </div>
  );
}

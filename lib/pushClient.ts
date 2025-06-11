// src/lib/pushClient.ts
export async function registrarPush() {
  if (!("serviceWorker" in navigator)) return

  const registration = await navigator.serviceWorker.register("/sw.js")

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  })

  await fetch("/api/guardarSubscription", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: { "Content-Type": "application/json" },
  })
}

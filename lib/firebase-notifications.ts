// src/lib/firebase-notifications.ts
let messaging: import("firebase/messaging").Messaging | null = null;

export async function solicitarPermisoYObtenerToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const { initializeApp, getApps, getApp } = await import("firebase/app");
  const { getMessaging, getToken } = await import("firebase/messaging");

  const firebaseConfig = {
    apiKey: "AIzaSyB9VoGSJtqFlIExA_8tEt516OkBUbu4G4A",
    authDomain: "tarrawatch-b888f.firebaseapp.com",
    projectId: "tarrawatch-b888f",
    messagingSenderId: "348082025465",
    appId: "1:348082025465:web:66904f6f8056caae464328",
  };

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  messaging = getMessaging(app);

  try {
    const token = await getToken(messaging, {
      vapidKey: "TU_VAPID_KEY_AQUÍ",
    });
    return token;
  } catch (error) {
    console.error("❌ Error al obtener token FCM:", error);
    return null;
  }
}

export async function escucharMensajes(callback: (payload: any) => void) {
  if (typeof window === "undefined") return;
  const { onMessage } = await import("firebase/messaging");
  if (messaging) {
    onMessage(messaging, callback);
  }
}

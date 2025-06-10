// src/lib/firebase-notifications.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB9VoGSJtqFlIExA_8tEt516OkBUbu4G4A",
  authDomain: "tarrawatch-b888f.firebaseapp.com",
  projectId: "tarrawatch-b888f",
  messagingSenderId: "348082025465",
  appId: "1:348082025465:web:66904f6f8056caae464328",
};

let app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export async function solicitarPermisoYObtenerToken(): Promise<string | null> {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BHbtWWbHMeNfolds-6qeXu--B86ghobjiMxIngT1I4BN4ZF9uLjXyN6fyjoysb1dpdUn3yecFR806rP04xBuflQQ",
    });
    return token;
  } catch (error) {
    console.error("Error al obtener token FCM:", error);
    return null;
  }
}

export { onMessage };

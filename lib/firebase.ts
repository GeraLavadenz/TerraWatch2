// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB9VoGSJtqFlIExA_8tEt516OkBUbu4G4A",
  authDomain: "tarrawatch-b888f.firebaseapp.com",
  databaseURL: "https://tarrawatch-b888f-default-rtdb.firebaseio.com",
  projectId: "tarrawatch-b888f",
  storageBucket: "tarrawatch-b888f.appspot.com",
  messagingSenderId: "348082025465",
  appId: "1:348082025465:web:66904f6f8056caae464328",
  measurementId: "G-XVV702VGEN",
};

// Inicializa la app solo si aún no está
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exportar Realtime Database
export const database = getDatabase(app);

// Configurar Firebase Cloud Messaging (FCM)
const messaging = getMessaging(app);

// Solicitar permiso y obtener token FCM
export async function solicitarPermisoYObtenerToken(): Promise<string | null> {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BHbtWWbHMeNfolds-6qeXu--B86ghobjiMxIngT1I4BN4ZF9uLjXyN6fyjoysb1dpdUn3yecFR806rP04xBuflQQ",
    });
    if (token) {
      console.log("📲 Token FCM obtenido:", token);
      return token;
    } else {
      console.warn("⚠️ No se pudo obtener el token de notificación.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error al obtener token FCM:", error);
    return null;
  }
}

// Notificaciones en primer plano
export { onMessage };

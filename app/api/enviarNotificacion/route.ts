// /app/api/enviarNotificacion/route.ts
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// Inicializar Firebase Admin con variables de entorno (NO JSON)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = getDatabase();

// Configurar Web Push con claves VAPID desde .env.local
webpush.setVapidDetails(
  "mailto:admin@terrawatch.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, message } = body;

  // Leer todas las suscripciones desde Firebase Realtime Database
  const tokensSnap = await db.ref("suscripciones").once("value");
  const suscripciones = tokensSnap.val();

  if (!suscripciones) {
    return NextResponse.json({ msg: "No hay suscripciones registradas" }, { status: 404 });
  }

  const resultados = [];

  for (const userId in suscripciones) {
    const suscripcion = suscripciones[userId];

    try {
      await webpush.sendNotification(
        suscripcion,
        JSON.stringify({ title, body: message })
      );
      resultados.push({ userId, estado: "Enviado" });
    } catch (err) {
      resultados.push({
        userId,
        estado: "Error",
        error: (err as Error).message,
      });
    }
  }

  return NextResponse.json({ resultados });
}

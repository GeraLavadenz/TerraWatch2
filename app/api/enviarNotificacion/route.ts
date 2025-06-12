import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// Inicializar Firebase Admin si aún no está inicializado
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

// Configurar claves VAPID para Web Push
webpush.setVapidDetails(
  "mailto:admin@terrawatch.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, message } = body;

    // Guardar notificación en Firebase
    const ahora = new Date();
    const fecha = ahora.toISOString().split("T")[0];
    const hora = ahora.toTimeString().split(" ")[0].slice(0, 5); // HH:MM

    await db.ref(`notificaciones/${fecha}/${hora}`).set({
      tipo: title,
      mensaje: message,
    });

    // Enviar notificación push a todos los suscritos
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

    return NextResponse.json({ msg: "Notificación guardada y enviada", resultados });
  } catch (error) {
    return NextResponse.json(
      { msg: "❌ Error al enviar o guardar notificación", error: String(error) },
      { status: 500 }
    );
  }
}

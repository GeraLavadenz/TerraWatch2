import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// ✅ Tipado de la suscripción Web Push
interface PushSubscription {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}

// ✅ Configurar Firebase Admin con credenciales desde variables de entorno
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FB_PROJECT_ID,
  private_key_id: process.env.FB_PRIVATE_KEY_ID,
  private_key: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FB_CLIENT_EMAIL,
  client_id: process.env.FB_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FB_CLIENT_CERT_URL,
  universe_domain: "googleapis.com",
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
    databaseURL: "https://tarrawatch-b888f-default-rtdb.firebaseio.com",
  });
}

const db = getDatabase();

// ✅ Configurar claves VAPID desde variables de entorno
webpush.setVapidDetails(
  "mailto:admin@terrawatch.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, message } = body as { title: string; message: string };

    const tokensSnap = await db.ref("suscripciones").once("value");
    const suscripciones = tokensSnap.val();

    if (!suscripciones) {
      return NextResponse.json(
        { msg: "No hay suscripciones registradas" },
        { status: 404 }
      );
    }

    const resultados: { userId: string; estado: string; error?: string }[] = [];

    for (const userId in suscripciones) {
      const suscripcion = suscripciones[userId] as PushSubscription;

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
  } catch (error) {
    return NextResponse.json(
      { msg: "Error procesando solicitud", error: (error as Error).message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// Credenciales desde variables de entorno (.env.local o configuraciones de Vercel)
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

export async function GET() {
  const hoy = new Date();
  const fecha = hoy.toISOString().split("T")[0];
  const lecturasRef = db.ref(`/lecturas/${fecha}`);
  const alertasRef = db.ref(`/alertas`);

  const snapshot = await lecturasRef.limitToLast(1).once("value");
  const alertasSnap = await alertasRef.once("value");

  const data = snapshot.val();
  const alertas = alertasSnap.val();

  if (!data || !alertas) {
    return NextResponse.json({ msg: "No hay datos" }, { status: 404 });
  }

  const hora = Object.keys(data)[0];
  const lectura = Object.values(data)[0] as any;

  const humedadSuelo = lectura.humedad_suelo_porcentaje || 0;
  const lluvia = lectura.lluvia_porcentaje || 0;
  const prolongada = alertas.lluvia_prolongada === "Sí";

  let mensaje = "Condiciones óptimas.";
  let tipo = "Información";
  let nivel = "Bajo";
  let sensores: string[] = [];

  if (humedadSuelo < 30 && lluvia < 20) {
    mensaje = "¡El suelo está muy seco y no llueve! Riego urgente recomendado.";
    tipo = "Peligro";
    nivel = "Alto";
    sensores = ["humedad_suelo", "lluvia"];
  } else if (humedadSuelo > 80 && lluvia > 80) {
    mensaje = "El suelo está saturado y sigue lloviendo. Riesgo de encharcamiento.";
    tipo = "Advertencia";
    nivel = "Alto";
    sensores = ["humedad_suelo", "lluvia"];
  } else if (prolongada) {
    mensaje = "Lluvia prolongada detectada. Monitorea el cultivo.";
    tipo = "Alerta";
    nivel = "Medio";
    sensores = ["lluvia", "lluvia_prolongada"];
  }

  const path = `/notificaciones/${fecha}/${hora}`;
  await db.ref(path).set({ mensaje, tipo, nivel, sensores });

  // ✅ Enviar notificación push si el mensaje no es neutro
  if (mensaje !== "Condiciones óptimas.") {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/generarNotificaciones`, {
      method: "POST",
      body: JSON.stringify({ mensaje, tipo }),
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.json({ mensaje, tipo, nivel, sensores });
}


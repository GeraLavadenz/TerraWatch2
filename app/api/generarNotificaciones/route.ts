import { NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// ✅ Tipado para lectura de sensores
interface LecturaSensor {
  humedad_suelo_porcentaje?: number;
  lluvia_porcentaje?: number;
  temperatura_c?: number;
  [clave: string]: number | undefined;
}

// ✅ Tipado personalizado para credenciales Firebase
interface FirebaseServiceAccount {
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

// ✅ Inicializar Firebase si no hay apps activas
const serviceAccount: FirebaseServiceAccount = {
  project_id: process.env.FB_PROJECT_ID!,
  private_key_id: process.env.FB_PRIVATE_KEY_ID!,
  private_key: process.env.FB_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  client_email: process.env.FB_CLIENT_EMAIL!,
  client_id: process.env.FB_CLIENT_ID!,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FB_CLIENT_CERT_URL!,
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
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

  const data = snapshot.val() as Record<string, LecturaSensor> | null;
  const alertas = alertasSnap.val() as { lluvia_prolongada?: string } | null;

  if (!data || !alertas) {
    return NextResponse.json({ msg: "No hay datos" }, { status: 404 });
  }

  const hora = Object.keys(data)[0];
  const lectura = data[hora];

  const humedadSuelo = lectura.humedad_suelo_porcentaje ?? 0;
  const lluvia = lectura.lluvia_porcentaje ?? 0;
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

  if (mensaje !== "Condiciones óptimas.") {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/generarNotificaciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: tipo, message: mensaje }),
    });
  }

  return NextResponse.json({ mensaje, tipo, nivel, sensores });
}

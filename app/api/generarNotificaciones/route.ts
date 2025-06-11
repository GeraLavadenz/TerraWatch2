import { NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// ✅ Obtener credenciales desde variables de entorno
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
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

  return NextResponse.json({ mensaje, tipo, nivel, sensores });
}

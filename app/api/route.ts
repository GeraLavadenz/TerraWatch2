import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = getDatabase();

export async function GET(req: NextRequest) {
  try {
    const now = new Date().toISOString();

    await db.ref("lecturas/lluvia").set({
      valor: Math.random() > 0.5 ? "Fuerte" : "Ligera",
      timestamp: now,
    });

    await db.ref("lecturas/humedad").set({
      valor: Math.floor(Math.random() * 100),
      timestamp: now,
    });

    return NextResponse.json({ msg: "✅ Datos simulados correctamente" });
  } catch (error) {
    return NextResponse.json(
      { msg: "❌ Error al simular datos", error: (error as Error).message },
      { status: 500 }
    );
  }
}

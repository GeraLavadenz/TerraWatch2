// /src/app/api/evaluarLluviaProlongada/route.ts
import { NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import serviceAccount from '@/lib/firebase/credentials.json';

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
    databaseURL: 'https://tarrawatch-b888f-default-rtdb.firebaseio.com',
  });
}

const db = getDatabase();

export async function GET() {
  try {
    const hoy = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const lecturasRef = db.ref(`/lecturas/${hoy}`);
    const snapshot = await lecturasRef.limitToLast(30).get(); // últimas 30 lecturas

    const datos = snapshot.val();
    if (!datos) return NextResponse.json({ message: 'Sin datos' }, { status: 404 });

    const valores = Object.values(datos) as any[];

    let ciclosSeguidos = 0;
    for (const lectura of valores) {
      const lluvia = lectura.lluvia_porcentaje;
      if (lluvia > 20) {
        ciclosSeguidos++;
      } else {
        ciclosSeguidos = 0;
      }
    }

    const prolongada = ciclosSeguidos >= 12 ? 'Sí' : 'No';
    await db.ref('/alertas/lluvia_prolongada').set(prolongada);

    return NextResponse.json({
      estado: 'OK',
      lluvia_prolongada: prolongada,
      ciclosDetectados: ciclosSeguidos,
    });
  } catch (error) {
    console.error('Error evaluando lluvia prolongada:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

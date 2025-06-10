// /src/app/api/evaluarLluviaProlongada/route.ts
// /src/app/api/evaluarLluviaProlongada/route.ts
import { NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getMessaging } from 'firebase-admin/messaging';
import serviceAccount from '@/credentials.json';

// Inicializar Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
    databaseURL: 'https://tarrawatch-b888f-default-rtdb.firebaseio.com',
  });
}

const db = getDatabase();

export async function GET() {
  try {
    const hoy = new Date().toISOString().split('T')[0];
    const lecturasRef = db.ref(`/lecturas/${hoy}`);
    const snapshot = await lecturasRef.limitToLast(30).get();

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

    // Guardar resultado
    await db.ref('/alertas/lluvia_prolongada').set(prolongada);

    // ⚠️ Si hay lluvia prolongada, enviar notificación
    if (prolongada === 'Sí') {
      const tokensRef = db.ref('/tokens');
      const tokensSnap = await tokensRef.get();
      const tokensObj = tokensSnap.val();

      if (tokensObj) {
        for (const userId in tokensObj) {
          const token = tokensObj[userId];
          await getMessaging().send({
            token,
            notification: {
              title: '🌧️ Lluvia Prolongada Detectada',
              body: 'Se ha detectado lluvia continua en TerraWatch. Revisa el sistema.',
            },
          });
          console.log(`📤 Notificación enviada a ${userId}`);
        }
      }
    }

    return NextResponse.json({
      lluvia_prolongada: prolongada,
      ciclosDetectados: ciclosSeguidos,
    });
  } catch (error) {
    console.error('❌ Error evaluando lluvia prolongada:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

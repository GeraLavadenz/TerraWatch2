import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { getDatabase } from 'firebase-admin/database';
import serviceAccount from '@/lib/firebase/credentials.json'; // ajusta ruta si es necesario

// Inicializar Firebase Admin una sola vez
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
    databaseURL: 'https://tarrawatch-b888f-default-rtdb.firebaseio.com',
  });
}

const db = getDatabase();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, titulo, mensaje } = body;

    if (!userId || !titulo || !mensaje) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // Buscar el token del usuario en Realtime DB
    const tokenSnap = await db.ref(`/tokens/${userId}`).get();
    const token = tokenSnap.val();

    if (!token) {
      return NextResponse.json({ error: 'Token no encontrado para el usuario' }, { status: 404 });
    }

    // Enviar notificación
    const respuesta = await getMessaging().send({
      token,
      notification: {
        title: titulo,
        body: mensaje,
      },
    });

    return NextResponse.json({ ok: true, messageId: respuesta });
  } catch (error: any) {
    console.error('❌ Error al enviar notificación:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

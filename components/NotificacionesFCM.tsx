'use client';

import { useEffect } from 'react';
import { solicitarPermisoYObtenerToken, escucharMensajes } from '@/lib/firebase-notifications';
import { ref, set } from 'firebase/database';
import { database } from '@/lib/firebase';

export default function NotificacionesFCM() {
  useEffect(() => {
    async function registrarToken() {
      const token = await solicitarPermisoYObtenerToken();
      if (token) {
        console.log('✅ Token FCM obtenido:', token);

        const userId = typeof window !== 'undefined'
          ? localStorage.getItem('usuarioId') || 'anonimo'
          : 'anonimo';

        await set(ref(database, `tokens/${userId}`), token);
        console.log(`📥 Token guardado en tokens/${userId}`);
      }
    }

    registrarToken();

    escucharMensajes((payload) => {
      alert(`🔔 ${payload.notification?.title}\n${payload.notification?.body}`);
    });
  }, []);

  return null;
}

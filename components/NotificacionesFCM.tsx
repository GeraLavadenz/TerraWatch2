'use client';

import { useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';
import {
  solicitarPermisoYObtenerToken,
  onMessage,
} from '@/lib/firebase-notifications';

export default function NotificacionesFCM() {
  useEffect(() => {
    async function registrarToken() {
      const token = await solicitarPermisoYObtenerToken();
      if (token) {
        const userId =
          typeof window !== 'undefined'
            ? localStorage.getItem('usuarioId') || token
            : token;

        const tokenRef = ref(database, `tokens/${userId}`);
        const snapshot = await get(tokenRef);
        if (!snapshot.exists() || snapshot.val() !== token) {
          await set(tokenRef, token);
        }
      }
    }

    registrarToken();

    onMessage((payload) => {
      alert(`🔔 ${payload.notification?.title}\n${payload.notification?.body}`);
    });
  }, []);

  return null;
}

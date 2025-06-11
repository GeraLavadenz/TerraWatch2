'use client'

import { useEffect } from 'react'
import { database } from '@/lib/firebase'
import { ref, set } from 'firebase/database'

export default function NotificacionesPush() {
  useEffect(() => {
    async function registrarSuscripcion() {
      if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

      const registro = await navigator.serviceWorker.register("/sw.js");
      const suscripcion = await registro.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      const userId = localStorage.getItem("usuarioId") || "anonimo";
      await set(ref(database, `suscripciones/${userId}`), suscripcion.toJSON());
      console.log("🔔 Suscripción registrada");
    }

    registrarSuscripcion();
  }, []);

  return null;
}

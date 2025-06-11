// src/components/RegistrarSuscripcion.tsx
'use client'
import { useEffect } from 'react'
import { database } from '@/lib/firebase'
import { ref, set } from 'firebase/database'

export default function RegistrarSuscripcion() {
  useEffect(() => {
    async function registrar() {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const sw = await navigator.serviceWorker.register('/sw.js')

        const sub = await sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: '<TU_PUBLIC_VAPID_KEY_BASE64>',
        })

        const userId = localStorage.getItem('usuarioId') || 'anonimo'
        await set(ref(database, `suscripciones/${userId}`), sub.toJSON())

        console.log('✅ Suscripción guardada en Firebase')
      }
    }

    registrar()
  }, [])

  return null
}

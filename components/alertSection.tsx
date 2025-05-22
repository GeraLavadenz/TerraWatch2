"use client"

import { useEffect, useState } from "react"
import { Terminal } from "lucide-react"
import { getDatabase, ref, onValue } from "firebase/database"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertSection() {
  const [lluvia, setLluvia] = useState("Cargando...")
  const [lluviaProlongada, setLluviaProlongada] = useState("Cargando...")
  const [humedad, setHumedad] = useState("Cargando...")

  useEffect(() => {
    const db = getDatabase()

    const refLluvia = ref(db, "alertas/lluvia")
    const refLluviaProlongada = ref(db, "alertas/lluvia_prolongada")
    const refHumedad = ref(db, "alertas/humedad")

    const unsubLluvia = onValue(refLluvia, (snap) => {
      setLluvia(snap.exists() ? snap.val() : "Sin datos")
    })

    const unsubLluviaProlongada = onValue(refLluviaProlongada, (snap) => {
      setLluviaProlongada(snap.exists() ? snap.val() : "Sin datos")
    })

    const unsubHumedad = onValue(refHumedad, (snap) => {
      setHumedad(snap.exists() ? snap.val() : "Sin datos")
    })

    return () => {
      unsubLluvia()
      unsubLluviaProlongada()
      unsubHumedad()
    }
  }, [])

  return (
    <div className="fixed top-16 right-0 w-72 p-4 h-full bg-white dark:bg-[#1a1a1a] border-l border-gray-300 dark:border-gray-700 shadow-md overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">🚨 Alertas del sistema</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">🌧️ Lluvia</h2>

        <Alert className="mb-3">
          <Terminal className="h-4 w-4 text-blue-500" />
          <AlertTitle>Intensidad</AlertTitle>
          <AlertDescription>{lluvia}</AlertDescription>
        </Alert>

        <Alert>
          <Terminal className="h-4 w-4 text-blue-500" />
          <AlertTitle>Prolongada</AlertTitle>
          <AlertDescription>{lluviaProlongada}</AlertDescription>
        </Alert>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">🌱 Humedad del Suelo</h2>
        <Alert>
          <Terminal className="h-4 w-4 text-green-500" />
          <AlertTitle>Estado</AlertTitle>
          <AlertDescription>{humedad}</AlertDescription>
        </Alert>
      </section>
    </div>
  )
}

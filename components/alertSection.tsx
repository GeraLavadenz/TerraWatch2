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
  const [lluvia, setLluvia] = useState<string | null>("Cargando...")
  const [lluviaProlongada, setLluviaProlongada] = useState<string | null>("Cargando...")
  const [humedad, setHumedad] = useState<string | null>("Cargando...")

  useEffect(() => {
    try {
      const db = getDatabase()

      onValue(ref(db, "alertas/lluvia"), (snap) => {
        if (snap.exists()) {
          setLluvia(snap.val())
        } else {
          setLluvia("Sin datos")
        }
      }, (error) => {
        console.error("Error leyendo lluvia:", error)
        setLluvia("Error")
      })

      onValue(ref(db, "alertas/lluvia_prolongada"), (snap) => {
        if (snap.exists()) {
          setLluviaProlongada(snap.val())
        } else {
          setLluviaProlongada("Sin datos")
        }
      }, (error) => {
        console.error("Error leyendo lluvia_prolongada:", error)
        setLluviaProlongada("Error")
      })

      onValue(ref(db, "alertas/humedad"), (snap) => {
        if (snap.exists()) {
          setHumedad(snap.val())
        } else {
          setHumedad("Sin datos")
        }
      }, (error) => {
        console.error("Error leyendo humedad:", error)
        setHumedad("Error")
      })
    } catch (err) {
      console.error("Error global en alertas:", err)
      setLluvia("Error")
      setLluviaProlongada("Error")
      setHumedad("Error")
    }
  }, [])

  return (
    <div className="fixed top-16 right-0 w-40 xl:w-60 p-4 h-full bg-white dark:bg-[#1a1a1a] border-l border-gray-300 dark:border-gray-700 shadow-md overflow-y-auto">
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

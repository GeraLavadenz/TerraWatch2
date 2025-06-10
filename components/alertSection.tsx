"use client"

import { useEffect, useState } from "react"
import { Terminal } from "lucide-react"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
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
  const db = database;

  // Lluvia normal
  onValue(ref(db, "alertas/lluvia"), (snap) =>
    setLluvia(snap.exists() ? snap.val() : "Sin datos")
  );

  // Lluvia prolongada - con detección de cambio
  let valorAnterior: string | null = null;
  onValue(ref(db, "alertas/lluvia_prolongada"), (snap) => {
    if (snap.exists()) {
      const nuevoValor = snap.val();
      if (nuevoValor !== valorAnterior) {
        setLluviaProlongada(nuevoValor);
        valorAnterior = nuevoValor;
        console.log("🔁 Lluvia prolongada actualizada:", nuevoValor);
      } else {
        console.log("🔇 Sin cambio en lluvia prolongada");
      }
    } else {
      setLluviaProlongada("Sin datos");
    }
  });

  // Humedad
  onValue(ref(db, "alertas/humedad"), (snap) =>
    setHumedad(snap.exists() ? snap.val() : "Sin datos")
  );
}, []);


  return (
    <div className="w-full">
      <h1 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">
        🚨 Alertas del sistema
      </h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
          🌧️ Lluvia
        </h2>
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
        <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
          🌱 Humedad del Suelo
        </h2>
        <Alert>
          <Terminal className="h-4 w-4 text-green-500" />
          <AlertTitle>Estado</AlertTitle>
          <AlertDescription>{humedad}</AlertDescription>
        </Alert>
      </section>
    </div>
  )
}

// Panel fijo solo para pantallas grandes
export function AlertPanelFijo() {
  return (
    <div className="hidden md:block fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] p-4 overflow-y-auto bg-white dark:bg-[#1a1a1a] border-l border-gray-300 dark:border-gray-700 shadow z-40">
      <AlertSection />
    </div>
  )
}

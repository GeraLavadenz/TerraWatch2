"use client"

import React, { useState } from "react"
import ComboboxTipo from "@/components/comboboxDiaMes"
import ComboboxFecha from "@/components/comboboxFeca"
import Header from "@/components/header"
import Menu from "@/components/Menu"
import { AlertSection } from "@/components/alertSection"

// Gráficos por día
import GraficoTempDia from "@/components/charts/GraficoLluviaDia"
import GraficoHumedadDia from "@/components/charts/GraficoHumedadDia"
import GraficoLluviaDia from "@/components/charts/GraficoLluviaDia"

// Gráficos por mes
import GraficoTempMes from "@/components/charts/GraficoLluviaMes"
import GraficoHumedadMes from "@/components/charts/GraficoHumedadMes"
import GraficoLluviaMes from "@/components/charts/GraficoLluviaMes"

export default function Reportes() {
  const [tipo, setTipo] = useState<"día" | "mes">("día")
  const [fecha, setFecha] = useState("")

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16"><Header /></div>

      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="w-26 xl:w-52 border-r overflow-y-auto"><Menu /></div>

        <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-6">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2 relative inline-block">
            📊 Reportes
            <span className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 animate-pulse"></span>
          </h1>

          {/* ComboBoxes */}
          <div className="flex space-x-4">
            <ComboboxTipo onChange={(v) => setTipo(v as "día" | "mes")} />
            <ComboboxFecha tipo={tipo} onChange={(v) => setFecha(v)} />
          </div>

          {/* Gráficos */}
          {fecha && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tipo === "día" ? (
                <>
                  <GraficoTempDia fecha={fecha} />
                  <GraficoHumedadDia fecha={fecha} />
                  <GraficoLluviaDia fecha={fecha} />
                </>
              ) : (
                <>
                  <GraficoTempMes mes={fecha} />
                  <GraficoHumedadMes mes={fecha} />
                  <GraficoLluviaMes mes={fecha} />
                </>
              )}
            </div>
          )}
        </div>

        <div className="w-40 xl:w-60 border-l overflow-y-auto p-4 hidden xl:block">
          <AlertSection />
        </div>
      </div>
    </div>
  )
}

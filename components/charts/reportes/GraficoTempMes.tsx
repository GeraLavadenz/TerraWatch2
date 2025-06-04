"use client"

import { useEffect, useState } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { RadialBarChart, RadialBar, Cell } from "recharts"

import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartConfig
} from "@/components/ui/chart"

const chartConfig = {
  temperatura: {
    label: "Temperatura promedio (°C)",
    color: "#58D68D",
  },
} satisfies ChartConfig

interface Lectura {
  temperatura_C?: number
}

interface Horas {
  [hora: string]: Lectura
}

interface DiaTemperatura {
  fecha: string
  temperatura: number
  color: string
}

const getColorPorTemperatura = (valor: number) => {
  if (valor <= 10) return "#5DADE2"  // Fría
  if (valor <= 25) return "#58D68D"  // Templada
  return "#E74C3C"                   // Calurosa
}

const getClimaIcono = (valor: number) => {
  if (valor <= 10) return "❄️"
  if (valor <= 25) return "🌥️"
  return "☀️"
}

export default function GraficoTempMes({ mes }: { mes: string }) {
  const [datos, setDatos] = useState<DiaTemperatura[]>([])

  useEffect(() => {
    if (!mes) return

    const ruta = ref(database, "lecturas")

    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}

      const diasDelMes = Object.entries(data).filter(([fecha]) =>
        fecha.startsWith(mes)
      )

      const formateado = diasDelMes.map(([fecha, horas]) => {
        const h = horas as Horas
        const valores = Object.values(h).map(
          lectura => lectura.temperatura_C ?? 0
        )
        const promedio = valores.length > 0
          ? valores.reduce((a, b) => a + b, 0) / valores.length
          : 0

        return {
          fecha,
          temperatura: parseFloat(promedio.toFixed(2)),
          color: getColorPorTemperatura(promedio),
        }
      })

      setDatos(formateado)
    })
  }, [mes])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>🌡️ Temperatura promedio por día</CardTitle>
        <CardDescription>{mes}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadialBarChart data={datos} innerRadius={30} outerRadius={110}>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null
                const valor = payload[0].value as number
                const fecha = payload[0].payload.fecha
                return (
                  <div className="rounded-md border bg-background px-3 py-1 text-sm shadow-sm">
                    <strong>{fecha}</strong>
                    <div className="pt-1">
                      {getClimaIcono(valor)} {valor} °C
                    </div>
                  </div>
                )
              }}
            />
            <RadialBar dataKey="temperatura" background>
              {datos.map((d, i) => (
                <Cell key={`cell-${i}`} fill={d.color} />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="text-sm text-muted-foreground flex flex-col gap-1">
        <div>Temperatura promedio diaria durante el mes seleccionado.</div>
        <div className="flex items-center justify-center gap-4 mt-2 text-xs">
          <span>❄️ Fría (0–10 °C)</span>
          <span>🌥️ Templada (11–25 °C)</span>
          <span>☀️ Calurosa (&gt;25 °C)</span>
        </div>
      </CardFooter>
    </Card>
  )
}


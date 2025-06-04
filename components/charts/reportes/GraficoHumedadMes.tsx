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
  humedad: {
    label: "Humedad promedio (%)",
    color: "#5DADE2",
  },
} satisfies ChartConfig

interface Lectura {
  humedad_suelo_porcentaje?: number
}

interface Horas {
  [hora: string]: Lectura
}

interface DiaHumedad {
  fecha: string
  humedad: number
  color: string
}

const getColorPorHumedad = (valor: number) => {
  if (valor <= 30) return "#85C1E9" // Baja
  if (valor <= 70) return "#5DADE2" // Media
  return "#2874A6"                 // Alta
}

const getIconoHumedad = (valor: number) => {
  if (valor <= 30) return "💧"
  if (valor <= 70) return "🌫️"
  return "💦"
}

export default function GraficoHumedadMes({ mes }: { mes: string }) {
  const [datos, setDatos] = useState<DiaHumedad[]>([])

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
          lectura => lectura.humedad_suelo_porcentaje ?? 0
        )
        const promedio = valores.length > 0
          ? valores.reduce((a, b) => a + b, 0) / valores.length
          : 0

        return {
          fecha,
          humedad: parseFloat(promedio.toFixed(2)),
          color: getColorPorHumedad(promedio),
        }
      })

      setDatos(formateado)
    })
  }, [mes])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>💧 Humedad promedio por día</CardTitle>
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
                    <div className="pt-1">{getIconoHumedad(valor)} {valor} %</div>
                  </div>
                )
              }}
            />
            <RadialBar dataKey="humedad" background>
              {datos.map((d, i) => (
                <Cell key={`cell-${i}`} fill={d.color} />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="text-sm text-muted-foreground flex flex-col gap-1">
        <div>Humedad del suelo promedio diaria durante el mes seleccionado.</div>
        <div className="flex items-center justify-center gap-4 mt-2 text-xs">
          <span>💧 Baja (&lt;=30%)</span>
          <span>🌫️ Media (31–70%)</span>
          <span>💦 Alta (&gt;70%)</span>
        </div>
      </CardFooter>
    </Card>
  )
}

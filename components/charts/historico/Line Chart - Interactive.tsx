"use client"

import * as React from "react"
import { ref, onValue } from "firebase/database"
import { database as db } from "@/lib/firebase"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  temperatura: {
    label: "Temperatura (°C)",
    color: "#60A1B0",
  },
  humedad: {
    label: "Humedad Suelo (%)",
    color: "#5AA792",
  },
  humedadAmb: {
    label: "Humedad Ambiente (%)",
    color: "#EAC66E",
  },
  lluvia: {
    label: "Lluvia (%)",
    color: "#6DBB74",
  },
}

type SensorData = {
  date: string
  temperatura: number
  humedad: number
  humedadAmb: number
  lluvia: number
}

type ValorLectura = {
  temperatura_C?: number
  humedad_suelo_porcentaje?: number
  humedad_ambiente?: number
  lluvia_porcentaje?: number
}

export function ChartLineMultiple() {
  const [chartData, setChartData] = React.useState<SensorData[]>([])

  React.useEffect(() => {
    const lecturasRef = ref(db, "lecturas")

    const unsubscribe = onValue(lecturasRef, (snapshot) => {
      const data = snapshot.val()
      if (!data || typeof data !== "object") return

      const registros: SensorData[] = []

      Object.entries(data).forEach(([fecha, horas]) => {
        Object.entries(horas as Record<string, ValorLectura>).forEach(
          ([hora, valores]) => {
            registros.push({
              date: `${fecha} ${hora}`,
              temperatura: Number(valores?.temperatura_C) || 0,
              humedad: Number(valores?.humedad_suelo_porcentaje) || 0,
              humedadAmb: Number(valores?.humedad_ambiente) || 0,
              lluvia: Number(valores?.lluvia_porcentaje) || 0,
            })
          }
        )
      })

      registros.sort((a, b) => a.date.localeCompare(b.date))
      setChartData(registros)
    })

    return () => unsubscribe()
  }, [])

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-start border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4">
          <CardTitle>📊 Sensores Ambientales Combinados</CardTitle>
          <CardDescription>Comparación de los 4 sensores desde Firebase</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("es-BO", {
                  day: "2-digit",
                  month: "short",
                })
              }
            />
            <YAxis />
            <Legend />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleString("es-BO", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "short",
                    })
                  }
                />
              }
            />

            {Object.entries(chartConfig).map(([key, cfg]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={cfg.label}
                stroke={cfg.color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

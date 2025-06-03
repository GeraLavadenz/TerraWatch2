"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { getDatabase, ref, onValue, DatabaseReference } from "firebase/database"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Definimos tipos para Firebase data estructurada
interface SensoresData {
  temperatura?: number
  humedad_ambiente?: number
  humedad_suelo?: number
  lluvia?: number
}

interface HorasData {
  [hora: string]: SensoresData
}

interface LecturasData {
  [fecha: string]: HorasData
}

interface ChartDataItem {
  tiempo: string
  temperatura: number
}

// Configuración de color
const chartConfig = {
  temperatura: {
    label: "Temperatura",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function TemperaturaLineChart() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([])

  useEffect(() => {
    const db = getDatabase()
    const lecturasRef: DatabaseReference = ref(db, "lecturas")

    const unsubscribe = onValue(lecturasRef, (snapshot) => {
      const data = snapshot.val() as LecturasData | null
      if (data && typeof data === "object") {
        const resultados: ChartDataItem[] = []

        Object.entries(data).forEach(([fecha, horasObj]) => {
          if (horasObj && typeof horasObj === "object") {
            Object.entries(horasObj).forEach(([hora, sensores]) => {
              if (
                sensores &&
                typeof sensores === "object" &&
                typeof sensores.temperatura === "number"
              ) {
                resultados.push({
                  tiempo: `${fecha} ${hora}`,
                  temperatura: sensores.temperatura,
                })
              }
            })
          }
        })

        resultados.sort((a, b) => (a.tiempo > b.tiempo ? 1 : -1))

        setChartData(resultados.slice(-50))
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Temperatura Ambiental</CardTitle>
        <CardDescription>Historial reciente en tiempo real</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: 12, right: 12, bottom: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="tiempo"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const parts = value.split(" ")
                  return parts.length === 2 ? parts[1] : value
                }}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                unit="°C"
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Line
                dataKey="temperatura"
                type="natural"
                stroke="var(--color-temperatura)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Datos en tiempo real <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Rango horario según últimas lecturas guardadas
        </div>
      </CardFooter>
    </Card>
  )
}

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
import { getDatabase, ref, onValue } from "firebase/database"

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

// Configuración de color
const chartConfig = {
  temperatura: {
    label: "Temperatura",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function TemperaturaLineChart() {
  const [chartData, setChartData] = useState<
    { tiempo: string; temperatura: number }[]
  >([])

  useEffect(() => {
    const db = getDatabase()
    const tempRef = ref(db, "historico/temperatura") // 📌 Ajusta la ruta según tu DB

    const unsubscribe = onValue(tempRef, (snapshot) => {
      const data = snapshot.val()
      if (data && typeof data === "object") {
        const parsed = Object.entries(data).map(([key, val]) => ({
          tiempo: key.slice(11, 16), // formato HH:mm
          temperatura: val,
        }))
        setChartData(parsed)
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
            <LineChart
              data={chartData}
              margin={{ left: 12, right: 12, bottom: 10 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="tiempo"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                unit="°C"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
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


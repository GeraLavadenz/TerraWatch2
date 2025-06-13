"use client"

import * as React from "react"
import { ref, onValue } from "firebase/database"
import { database as db } from "@/lib/firebase"
import {
  CartesianGrid, Line, LineChart, XAxis, YAxis
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  temperatura: { label: "Temperatura (°C)", color: "#60A1B0" },
  humedad: { label: "Humedad Suelo (%)", color: "#5AA792" },
  humedadAmb: { label: "Humedad Ambiente (%)", color: "#EAC66E" },
  lluvia: { label: "Lluvia (%)", color: "#6DBB74" },
} satisfies ChartConfig

type SensorData = {
  date: string;
  temperatura: number;
  humedad: number;
  humedadAmb: number;
  lluvia: number;
}

type ValorLectura = {
  temperatura_C?: number;
  humedad_suelo_porcentaje?: number;
  humedad_ambiente?: number;
  lluvia_porcentaje?: number;
}

export function ChartLineInteractive() {
  const [chartData, setChartData] = React.useState<SensorData[]>([])
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("temperatura")

  React.useEffect(() => {
    const lecturasRef = ref(db, "lecturas")

    const unsubscribe = onValue(lecturasRef, (snapshot) => {
      const data = snapshot.val()
      if (!data || typeof data !== "object") return

      const registros: SensorData[] = []

      Object.entries(data).forEach(([fecha, horas]) => {
        Object.entries(horas as Record<string, ValorLectura>).forEach(([hora, valores]) => {
          registros.push({
            date: `${fecha} ${hora}`,
            temperatura: Number(valores?.temperatura_C) || 0,
            humedad: Number(valores?.humedad_suelo_porcentaje) || 0,
            humedadAmb: Number(valores?.humedad_ambiente) || 0,
            lluvia: Number(valores?.lluvia_porcentaje) || 0,
          })
        })
      })

      registros.sort((a, b) => a.date.localeCompare(b.date))
      setChartData(registros)
    })

    return () => unsubscribe()
  }, [])

  const total = React.useMemo(() => {
    return chartData.reduce(
      (acc, curr) => ({
        temperatura: acc.temperatura + curr.temperatura,
        humedad: acc.humedad + curr.humedad,
        humedadAmb: acc.humedadAmb + curr.humedadAmb,
        lluvia: acc.lluvia + curr.lluvia,
      }),
      { temperatura: 0, humedad: 0, humedadAmb: 0, lluvia: 0 }
    )
  }, [chartData])

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>📈 Línea de Sensores Ambientales</CardTitle>
          <CardDescription>
            Datos en tiempo real 
          </CardDescription>
        </div>
        <div className="flex flex-wrap justify-start sm:justify-end">
          {Object.keys(chartConfig).map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-col justify-center gap-1 border-t px-6 py-3 text-left even:border-l sm:border-t-0 sm:border-l sm:px-6 sm:py-4"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-2xl">
                  {total[chart].toFixed(1)}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
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
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleTimeString("es-BO", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })
                  }
                />
              }
            />
            <Line
              type="monotone"
              dataKey={activeChart}
              stroke={chartConfig[activeChart].color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

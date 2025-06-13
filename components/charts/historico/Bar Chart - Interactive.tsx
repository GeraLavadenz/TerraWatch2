"use client"

import * as React from "react"
import { ref, onValue } from "firebase/database"
import { database as db } from "@/lib/firebase"
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend
} from "recharts"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent
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

export function ComponentChartsInteractive() {
  const [chartData, setChartData] = React.useState<SensorData[]>([])
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("temperatura")
  const [total, setTotal] = React.useState({
    temperatura: 0,
    humedad: 0,
    humedadAmb: 0,
    lluvia: 0,
  })

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

      const totals = registros.reduce(
        (acc, curr) => ({
          temperatura: acc.temperatura + curr.temperatura,
          humedad: acc.humedad + curr.humedad,
          humedadAmb: acc.humedadAmb + curr.humedadAmb,
          lluvia: acc.lluvia + curr.lluvia,
        }),
        { temperatura: 0, humedad: 0, humedadAmb: 0, lluvia: 0 }
      )

      setTotal(totals)
    })

    return () => unsubscribe()
  }, [])

  return (
    <Card className="bg-card text-card-foreground border border-border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center border-b p-0">
        <div className="flex-1 px-6 py-5">
          <CardTitle>📊 Datos Ambientales</CardTitle>
          <CardDescription>Histórico de sensores y total acumulado</CardDescription>
        </div>

        <div className="flex divide-x divide-border border-t sm:border-t-0 sm:border-l">
          {Object.keys(chartConfig).map((key) => {
            const chart = key as keyof typeof chartConfig
            const isActive = activeChart === chart
            return (
              <button
                key={chart}
                onClick={() => setActiveChart(chart)}
                className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 text-left transition-colors ${
                  isActive ? "bg-muted/40" : ""
                }`}
              >
                <span className={`text-xs ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {chartConfig[chart].label}
                </span>
                <div className={`${
                  isActive ? "text-2xl font-bold text-primary" : "text-base font-semibold text-muted-foreground"
                }`}>
                  {total[chart].toLocaleString()}
                </div>
              </button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-5">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
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
            <Bar
              dataKey={activeChart}
              name={chartConfig[activeChart].label}
              fill={chartConfig[activeChart].color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

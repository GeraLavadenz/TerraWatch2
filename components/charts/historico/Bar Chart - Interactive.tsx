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

// Configuración de color
const chartConfig = {
  temperatura: { label: "Temperatura (°C)", color: "#64551f" },
  humedad: { label: "Humedad (%)", color: "#167f1b" },
  lluvia: { label: "Lluvia (%)", color: "#0f7176" },
} satisfies ChartConfig

// Tipo para los datos obtenidos de Firebase
type SensorData = {
  date: string;
  temperatura: number;
  humedad: number;
  lluvia: number;
};

export function ComponentChartsInteractive() {
  const [chartData, setChartData] = React.useState<SensorData[]>([])
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("temperatura")
  const [total, setTotal] = React.useState({ temperatura: 0, humedad: 0, lluvia: 0 })

  React.useEffect(() => {
    // Referencias a los datos de cada sensor
    const tempRef = ref(db, "lecturas")
    const fetchData = () => {
      let tempData: Record<string, number> = {}
      let humData: Record<string, number> = {}
      let lluvData: Record<string, number> = {}

      onValue(tempRef, (snapshot) => {
        const data = snapshot.val() || {}
        let tempData: Record<string, number> = {}
        let humData: Record<string, number> = {}
        let lluvData: Record<string, number> = {}
        Object.entries(data).forEach(([fecha, horasObj]) => {
          if (typeof horasObj === "object") {
            Object.entries(horasObj).forEach(([hora, sensores]) => {
              tempData[fecha] = sensores.temperatura || 0
              humData[fecha] = sensores.humedad_ambiente || 0
              lluvData[fecha] = sensores.lluvia || 0
            })
          }
        })

        const fechas = Array.from(
          new Set([
            ...Object.keys(tempData),
            ...Object.keys(humData),
            ...Object.keys(lluvData),
          ])
        ).sort()

        // Merge data based on unique dates
        const mergedData = fechas.map((fecha) => ({
          date: fecha,
          temperatura: tempData[fecha] || 0,
          humedad: humData[fecha] || 0,
          lluvia: lluvData[fecha] || 0,
        }))

        // Totals calculation
        const totals = mergedData.reduce(
          (acc, curr) => ({
            temperatura: acc.temperatura + curr.temperatura,
            humedad: acc.humedad + curr.humedad,
            lluvia: acc.lluvia + curr.lluvia,
          }),
          { temperatura: 0, humedad: 0, lluvia: 0 }
        )

        setChartData(mergedData)
        setTotal(totals)
      })
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Datos Ambientales</CardTitle>
          <CardDescription>Histórico de sensores y total acumulado</CardDescription>
        </div>

        {/* Totales de cada sensor */}
        <div className="flex">
          {Object.keys(chartConfig).map((key) => {
            const chart = key as keyof typeof chartConfig
            const isActive = activeChart === chart
            return (
              <button
                key={chart}
                onClick={() => setActiveChart(chart)}
                className={`relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6 ${
                  isActive ? "bg-muted/50" : ""
                }`}
              >
                <span className={`text-xs ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {chartConfig[chart].label}
                </span>
                <span className={`${
                  isActive
                    ? "text-3xl font-bold text-primary"
                    : "text-base font-semibold text-muted-foreground"
                }`}>
                  {total[chart].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
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
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

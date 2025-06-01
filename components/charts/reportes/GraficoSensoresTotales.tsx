"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { getDatabase, ref, onValue } from "firebase/database"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartConfig = {
  temperatura: {
    label: "Temperatura (°C)",
    color: "hsl(var(--chart-1))",
  },
  humedad: {
    label: "Humedad (%)",
    color: "hsl(var(--chart-2))",
  },
  lluvia: {
    label: "Lluvia (mm)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

interface Lectura {
  temperatura?: number
  humedad_suelo?: number
  lluvia?: number
}

interface Horas {
  [hora: string]: Lectura
}

interface DatosDia {
  date: string
  temperatura: number
  humedad: number
  lluvia: number
}

export function GraficoSensoresTotales() {
  const [timeRange, setTimeRange] = React.useState("30d")
  const [datos, setDatos] = React.useState<DatosDia[]>([])

  React.useEffect(() => {
    const db = getDatabase()
    const lecturasRef = ref(db, "lecturas")

    onValue(lecturasRef, (snapshot) => {
      const data = snapshot.val() || {}
      const entradas = Object.entries(data).map(([fecha, horas]) => {
        const h = horas as Horas
        const lecturas = Object.values(h)
        const n = lecturas.length
        const suma = lecturas.reduce(
          (acc, val) => {
            acc.temperatura += val.temperatura ?? 0
            acc.humedad += val.humedad_suelo ?? 0
            acc.lluvia += val.lluvia ?? 0
            return acc
          },
          { temperatura: 0, humedad: 0, lluvia: 0 }
        )
        return {
          date: fecha,
          temperatura: n > 0 ? +(suma.temperatura / n).toFixed(1) : 0,
          humedad: n > 0 ? +(suma.humedad / n).toFixed(1) : 0,
          lluvia: n > 0 ? +(suma.lluvia / n).toFixed(1) : 0,
        }
      })
      setDatos(entradas)
    })
  }, [])

  const filteredData = datos.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date()
    let daysToSubtract = 30
    if (timeRange === "90d") daysToSubtract = 90
    if (timeRange === "7d") daysToSubtract = 7
    const startDate = new Date(referenceDate)
    startDate.setDate(referenceDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>📈 Promedios diarios por sensor</CardTitle>
          <CardDescription>Selecciona un rango de tiempo</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Últimos 30 días" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Últimos 3 meses</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillHumedad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillLluvia" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("es-BO", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("es-BO", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="temperatura"
              type="monotone"
              fill="url(#fillTemp)"
              stroke="hsl(var(--chart-1))"
            />
            <Area
              dataKey="humedad"
              type="monotone"
              fill="url(#fillHumedad)"
              stroke="hsl(var(--chart-2))"
            />
            <Area
              dataKey="lluvia"
              type="monotone"
              fill="url(#fillLluvia)"
              stroke="hsl(var(--chart-3))"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

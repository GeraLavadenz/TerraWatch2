"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { getDatabase, ref, onValue } from "firebase/database"
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts"

import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig
} from "@/components/ui/chart"

const chartConfig = {
  temperatura: { label: "Temperatura (°C)" },
} satisfies ChartConfig

export default function GraficoTempMes({ mes }: { mes: string }) {
  const [datos, setDatos] = useState<any[]>([])

  useEffect(() => {
    const db = getDatabase()
    const ruta = ref(db, "lecturas")

    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}
      const diasDelMes = Object.entries(data).filter(([fecha]) => fecha.startsWith(mes))

      const formateado = diasDelMes.map(([fecha, horas]: any) => {
        const temps = Object.values(horas).map((lectura: any) => lectura.temperatura || 0)
        const promedio = temps.length > 0
          ? temps.reduce((a, b) => a + b, 0) / temps.length
          : 0
        return {
          fecha,
          temperatura: parseFloat(promedio.toFixed(1))
        }
      })

      setDatos(formateado)
    })
  }, [mes])

  return (
    <Card>
      <CardHeader>
        <CardTitle>🌡️ Temperatura promedio diaria</CardTitle>
        <CardDescription>{mes}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={datos}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey="temperatura">
              <LabelList position="top" dataKey="fecha" fillOpacity={1} />
              {datos.map((item, index) => (
                <Cell
                  key={index}
                  fill={
                    item.temperatura >= 0
                      ? "hsl(var(--chart-1))"
                      : "hsl(var(--chart-2))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Promedio diario de temperatura durante el mes.
      </CardFooter>
    </Card>
  )
}

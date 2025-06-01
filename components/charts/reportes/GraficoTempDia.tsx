"use client"

import { useEffect, useState } from "react"
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

interface LecturaHora {
  hora: string
  temperatura: number
}

export default function GraficoTempDia({ fecha }: { fecha: string }) {
  const [datos, setDatos] = useState<LecturaHora[]>([])

  useEffect(() => {
    const db = getDatabase()
    const ruta = ref(db, `lecturas/${fecha}`)

    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}
      const formateado = Object.entries(data).map(([hora, valores]) => {
        const v = valores as { temperatura?: number }
        return {
          hora,
          temperatura: v.temperatura ?? 0,
        }
      })
      setDatos(formateado)
    })
  }, [fecha])

  return (
    <Card>
      <CardHeader>
        <CardTitle>🌡️ Temperatura por hora</CardTitle>
        <CardDescription>{fecha}</CardDescription>
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
              <LabelList position="top" dataKey="hora" fillOpacity={1} />
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
        Temperatura registrada hora por hora.
      </CardFooter>
    </Card>
  )
}

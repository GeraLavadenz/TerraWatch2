"use client"

import { useEffect, useState } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import {
  Bar, BarChart, CartesianGrid, Cell,
  XAxis, YAxis
} from "recharts"

import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig
} from "@/components/ui/chart"

const chartConfig = {
  lluvia: { label: "Lluvia (%)" },
} satisfies ChartConfig

interface LecturaHora {
  hora: string
  lluvia: number
}

export default function GraficoLluviaDia({ fecha }: { fecha: string }) {
  const [datos, setDatos] = useState<LecturaHora[]>([])

  useEffect(() => {
    if (!fecha || fecha.trim() === "") return
    const ruta = ref(database, `lecturas/${fecha}`)

    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}
      const formateado = Object.entries(data).map(([hora, valores]) => {
        const v = valores as { lluvia_porcentaje?: number }
        return {
          hora,
          lluvia: v.lluvia_porcentaje ?? 0,
        }
      })
      setDatos(formateado)
    })
  }, [fecha])

  const getColorPorLluvia = (lluvia: number) => {
    if (lluvia <= 30) return "#A0D9C2" // baja
    if (lluvia <= 70) return "#5AA792" // media
    return "#2F7F6D"                  // alta
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🌧️ Lluvia por hora</CardTitle>
        <CardDescription>{fecha}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={datos}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="hora" tick={{ fontSize: 10 }} />
            <YAxis
              label={{ value: "%", angle: -90, position: "insideLeft", dy: 60 }}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideIndicator nameKey="hora" />}
            />
            <Bar dataKey="lluvia">
              {datos.map((item, index) => (
                <Cell
                  key={index}
                  fill={getColorPorLluvia(item.lluvia)}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Lluvia registrada hora por hora.
      </CardFooter>
    </Card>
  )
}


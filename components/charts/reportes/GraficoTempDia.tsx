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
  temperatura: { label: "Temperatura (°C)" },
} satisfies ChartConfig

interface LecturaHora {
  hora: string
  temperatura: number
}

export default function GraficoTempDia({ fecha }: { fecha: string }) {
  const [datos, setDatos] = useState<LecturaHora[]>([])

  useEffect(() => {
    if (!fecha || fecha.trim() === "") return
    const ruta = ref(database, `lecturas/${fecha}`)

    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}
      const formateado = Object.entries(data).map(([hora, valores]) => {
        const v = valores as { temperatura_C?: number }
        return {
          hora,
          temperatura: v.temperatura_C ?? 0,
        }
      })
      setDatos(formateado)
    })
  }, [fecha])

  const getColorPorTemperatura = (temp: number) => {
    if (temp <= 10) return "#5DADE2"   // azul claro
    if (temp <= 25) return "#58D68D"   // verde claro
    return "#E74C3C"                   // rojo suave
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🌡️ Temperatura por hora</CardTitle>
        <CardDescription>{fecha}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={datos}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="hora" tick={{ fontSize: 10 }} />
            <YAxis
              label={{ value: "°C", angle: -90, position: "insideLeft", dy: 60 }}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideIndicator nameKey="hora" />}
            />
            <Bar dataKey="temperatura">
              {datos.map((item, index) => (
                <Cell
                  key={index}
                  fill={getColorPorTemperatura(item.temperatura)}
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


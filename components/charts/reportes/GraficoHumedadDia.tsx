"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import { getDatabase, ref, onValue } from "firebase/database"

import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig
} from "@/components/ui/chart"

const chartConfig = {
  valor: {
    label: "Humedad (%)",
    color: "hsl(var(--chart-1))", // por si se requiere como fallback
  }
} satisfies ChartConfig

interface Lectura {
  hora: string
  valor: number
}

type Valores = {
  humedad_suelo_porcentaje?: number
}

const getColorPorHumedad = (valor: number) => {
  if (valor <= 30) return "#F7DC6F"   // Amarillo claro (seca)
  if (valor <= 70) return "#5DADE2"   // Azul claro (óptima)
  return "#2874A6"                    // Azul oscuro (muy húmeda)
}

export default function GraficoHumedadDia({ fecha }: { fecha: string }) {
  const [datos, setDatos] = useState<Lectura[]>([])

  useEffect(() => {
    const db = getDatabase()
    const ruta = ref(db, `lecturas/${fecha}`)

    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}
      const formateado = Object.entries(data).map(([hora, valores]) => {
        const v = valores as Valores
        return {
          hora,
          valor: v.humedad_suelo_porcentaje ?? 0,
        }
      })
      setDatos(formateado)
    })
  }, [fecha])

  return (
    <Card>
      <CardHeader>
        <CardTitle>💧 Humedad por hora</CardTitle>
        <CardDescription>{fecha}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={datos}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="hora" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis label={{ value: "%", angle: -90, position: "insideLeft", dy: 60 }} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" nameKey="hora" />} />
            <Bar dataKey="valor" radius={4}>
              {datos.map((item, index) => (
                <Cell key={index} fill={getColorPorHumedad(item.valor)} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Humedad registrada por hora en el día seleccionado.
      </CardFooter>
    </Card>
  )
}

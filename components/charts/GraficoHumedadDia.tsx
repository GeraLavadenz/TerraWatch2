"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
    label: "Humedad",
    color: "hsl(var(--chart-1))",
  }
} satisfies ChartConfig

export default function GraficoHumedadDia({ fecha }: { fecha: string }) {
  const [datos, setDatos] = useState<any[]>([])

  useEffect(() => {
    const db = getDatabase()
    const ruta = ref(db, `lecturas/${fecha}`)

    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}
      const formateado = Object.entries(data).map(([hora, valores]: any) => ({
        hora,
        valor: valores.humedad_suelo || 0
      }))
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
          <BarChart accessibilityLayer data={datos}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="hora" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="valor" fill="var(--color-valor)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Humedad registrada por hora en el día seleccionado.
      </CardFooter>
    </Card>
  )
}

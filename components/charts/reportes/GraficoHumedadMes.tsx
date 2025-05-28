"use client"

import { useEffect, useState } from "react"
//import { TrendingUp } from "lucide-react"
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

export default function GraficoHumedadMes({ mes }: { mes: string }) {
  const [datos, setDatos] = useState<any[]>([])

  useEffect(() => {
    const db = getDatabase()
    const ruta = ref(db, "lecturas")

    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}
      const diasDelMes = Object.entries(data).filter(([fecha]) => fecha.startsWith(mes))

      const resumen = diasDelMes.map(([fecha, horas]: any) => {
        const lecturas = Object.values(horas).map((lectura: any) => lectura.humedad_suelo || 0)
        const promedio = lecturas.length > 0
          ? lecturas.reduce((a, b) => a + b, 0) / lecturas.length
          : 0
        return { fecha, valor: parseFloat(promedio.toFixed(1)) }
      })

      setDatos(resumen)
    })
  }, [mes])

  return (
    <Card>
      <CardHeader>
        <CardTitle>💧 Promedio de humedad por día</CardTitle>
        <CardDescription>{mes}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={datos}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="fecha" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="valor" fill="var(--color-valor)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Promedio de humedad diario en el mes seleccionado.
      </CardFooter>
    </Card>
  )
}


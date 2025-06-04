"use client"

import { useEffect, useState } from "react"
//import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  temperatura: { label: "Temperatura (°C)", color: "hsl(var(--chart-1))" },
  humedad: { label: "Humedad (%)", color: "hsl(var(--chart-2))" },
  lluvia: { label: "Lluvia (%)", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

export function ComponentLecturasActualesTemp() {
  const [datos, setDatos] = useState([
    { tipo: "Temperatura", valor: 0 },
    { tipo: "Humedad", valor: 0 },
    { tipo: "Lluvia", valor: 0 },
  ])

  useEffect(() => {
    const db = database
    const ruta = ref(db, "lecturas_actuales")

    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}
      setDatos([
        { tipo: "Temperatura", valor: data.temperatura_C ?? 0 },
        { tipo: "Humedad", valor: data.humedad_suelo_porcentaje ?? 0 },
        { tipo: "Lluvia", valor: data.lluvia_porcentaje ?? 0 },
      ])
    })
  }, [])

  const getColor = (tipo: string) => {
    if (tipo === "Temperatura") return chartConfig.temperatura.color
    if (tipo === "Humedad") return chartConfig.humedad.color
    return chartConfig.lluvia.color
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Lecturas actuales</CardTitle>
        <CardDescription>Datos en tiempo real</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={datos}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="tipo" tickLine={false} tickMargin={8} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideIndicator />}
            />
            <Bar dataKey="valor">
              <LabelList dataKey="valor" position="top" />
              {datos.map((item, i) => (
                <Cell key={i} fill={getColor(item.tipo)} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Actualizado en vivo desde <code>lecturas_actuales</code>.
      </CardFooter>
    </Card>
  )
}

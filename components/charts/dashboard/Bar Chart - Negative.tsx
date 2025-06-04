"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
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
} satisfies ChartConfig

const getColor = (tipo: string) => {
  if (tipo === "Temperatura") return chartConfig.temperatura.color
  return undefined
}

export function ComponentLecturasActualesTemp() {
  const [datos, setDatos] = useState([
    { tipo: "Temperatura", valor: 0 },
  ])

  useEffect(() => {
    const db = database
    const ruta = ref(db, "lecturas_actuales")

    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}
      setDatos([
        { tipo: "Temperatura", valor: data.temperatura_C ?? 0 },
      ])
    })
  }, [])

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
            <YAxis /> {/* ← Agregado para mostrar valores en el eje Y */}
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
        Temperatura Ambiental
      </CardFooter>
    </Card>
  )
}

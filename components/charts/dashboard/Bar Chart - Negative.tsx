"use client"

import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
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

// Config de etiqueta
const chartConfig = {
  temperatura: {
    label: "Temperatura (°C)",
    color: "#5AA792", // Turquesa fijo
  },
} satisfies ChartConfig



export function ComponentLecturasActualesTemp() {
  const [datos, setDatos] = useState([
    { tipo: "Temperatura", valor: 0 },
  ])

  useEffect(() => {
    const ruta = ref(database, "lecturas_actuales")
    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}
      setDatos([
        { tipo: "Temperatura", valor: data.temperatura_C ?? 0 },
      ])
    })
  }, [])

  return (
    <Card className="bg-card text-card-foreground shadow-md border border-border transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          🌡️ Lecturas Actuales
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Datos en tiempo real desde sensores
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={datos}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="tipo"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted) / 0.2)" }}
                content={<ChartTooltipContent hideIndicator />}
              />
              <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                <LabelList
                  dataKey="valor"
                  position="top"
                  style={{ fill: "hsl(var(--foreground))", fontWeight: 500 }}
                />
                {datos.map((item, index) => (
                  <Cell key={index} fill={getColor(item.tipo)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="text-sm text-muted-foreground">
        Temperatura ambiental actual en °C
      </CardFooter>
    </Card>
  )
}

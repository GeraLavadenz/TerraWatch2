"use client"

import { useEffect, useState } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { RadialBarChart, RadialBar } from "recharts"

import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig
} from "@/components/ui/chart"

const chartConfig = {
  lluvia: { label: "Lluvia", color: "hsl(var(--chart-1))" }
} satisfies ChartConfig

interface Valores {
  lluvia?: number
}

interface LecturaDia {
  hora: string
  lluvia: number
  fill: string
}

export default function GraficoLluviaDia({ fecha }: { fecha: string }) {
  const [datos, setDatos] = useState<LecturaDia[]>([])

    useEffect(() => {
    const db = database
    const ruta = ref(db, `lecturas/${fecha}`)

    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}
      const formateado = Object.entries(data).map(([hora, valores]) => {
        const v = valores as Valores
        return {
          hora,
          lluvia: v.lluvia ?? 0,
          fill: "var(--color-lluvia)"
        }
      })
      setDatos(formateado)
    })
  }, [fecha])


  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>🌧️ Lluvia por hora</CardTitle>
        <CardDescription>{fecha}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={datos} innerRadius={30} outerRadius={110}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="hora" />}
            />
            <RadialBar dataKey="lluvia" background />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Lluvia registrada por hora durante el día seleccionado.
      </CardFooter>
    </Card>
  )
}

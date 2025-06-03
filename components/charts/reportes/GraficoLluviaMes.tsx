"use client"

import { useEffect, useState } from "react"
import { getDatabase, ref, onValue } from "firebase/database"
import { RadialBarChart, RadialBar } from "recharts"

import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig
} from "@/components/ui/chart"

// Configuración de color
const chartConfig = {
  lluvia: { label: "Lluvia", color: "hsl(var(--chart-2))" }
} satisfies ChartConfig

// Tipos para las lecturas por hora y día
interface Lectura {
  lluvia?: number
}

interface Horas {
  [hora: string]: Lectura
}

interface DiaLluvia {
  fecha: string
  lluvia: number
  fill: string
}

export default function GraficoLluviaMes({ mes }: { mes: string }) {
  const [datos, setDatos] = useState<DiaLluvia[]>([])

  useEffect(() => {
    const db = getDatabase()
    const ruta = ref(db, "lecturas")

    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}
      // Filtrar los días que corresponden al mes seleccionado
      const diasDelMes = Object.entries(data).filter(([fecha]) => fecha.startsWith(mes))

      // Procesar los datos para cada día
      const formateado = diasDelMes.map(([fecha, horas]) => {
        const h = horas as Horas
        // Obtener todas las lecturas de lluvia para cada hora del día
        const lluvias = Object.values(h).map(lectura => lectura.lluvia ?? 0)
        // Sumar todas las lluvias del día
        const total = lluvias.reduce((a, b) => a + b, 0)

        // Devolver la fecha y el total de lluvia del día
        return { fecha, lluvia: total, fill: "var(--color-lluvia)" }
      })

      // Actualizar el estado con los datos formateados
      setDatos(formateado)
    })
  }, [mes])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>🌧️ Lluvia acumulada por día</CardTitle>
        <CardDescription>{mes}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={datos} innerRadius={30} outerRadius={110}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="fecha" />}
            />
            <RadialBar dataKey="lluvia" background />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Lluvia total por día durante el mes seleccionado.
      </CardFooter>
    </Card>
  )
}

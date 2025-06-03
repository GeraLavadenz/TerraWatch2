"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { getDatabase, ref, onValue } from "firebase/database"

import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig
} from "@/components/ui/chart"

// Configuración de color para la humedad
const chartConfig = {
  valor: {
    label: "Humedad",
    color: "hsl(var(--chart-1))",
  }
} satisfies ChartConfig

// Tipos de los datos de lectura por hora
interface Lectura {
  humedad_suelo?: number
}

// Tipo para las horas de un día (clave: hora, valor: Lectura)
interface Horas {
  [hora: string]: Lectura
}

// Tipo para cada día con la fecha y el valor promedio de humedad
interface DiaResumen {
  fecha: string
  valor: number
}

export default function GraficoHumedadMes({ mes }: { mes: string }) {
  const [datos, setDatos] = useState<DiaResumen[]>([])

  useEffect(() => {
    const db = getDatabase()
    const ruta = ref(db, "lecturas")

    onValue(ruta, (snapshot) => {
      const data = snapshot.val() || {}
      // Filtrar los días que corresponden al mes seleccionado
      const diasDelMes = Object.entries(data).filter(([fecha]) => fecha.startsWith(mes))

      // Calcular el promedio de humedad por cada día
      const resumen = diasDelMes.map(([fecha, horas]) => {
        const h = horas as Horas
        const lecturas = Object.values(h).map(lectura => lectura.humedad_suelo ?? 0) // Si no hay valor, asignamos 0
        const promedio = lecturas.length > 0
          ? lecturas.reduce((a, b) => a + b, 0) / lecturas.length
          : 0
        return { fecha, valor: parseFloat(promedio.toFixed(1)) } // Redondeamos a un decimal
      })

      setDatos(resumen) // Actualizar el estado con los datos procesados
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
            <Bar dataKey="valor" fill={chartConfig.valor.color} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Promedio de humedad diario en el mes seleccionado.
      </CardFooter>
    </Card>
  )
}

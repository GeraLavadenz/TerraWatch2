"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { getDatabase, ref, onValue } from "firebase/database"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function HumedadChart() {
  const [humedad, setHumedad] = useState(0)

  useEffect(() => {
    const db = getDatabase()
    const humedadRef = ref(db, "sensores/humedadTierra") // ⚠️ ajusta esta ruta
    const unsubscribe = onValue(humedadRef, (snapshot) => {
      const val = snapshot.val()
      if (typeof val === "number" && val >= 0 && val <= 100) {
        setHumedad(val)
      }
    })
    return () => unsubscribe()
  }, [])

  const color =
    humedad >= 70 ? "#4ade80" : humedad >= 40 ? "#facc15" : "#ef4444" // verde, amarillo, rojo

  const chartData = [
    {
      humedad: humedad,
      restante: 100 - humedad,
    },
  ]

  const chartConfig = {
    humedad: {
      label: "Humedad",
      color,
    },
    restante: {
      color: "#e5e7eb",
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Humedad del Suelo</CardTitle>
        <CardDescription>Actualizado en tiempo real</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {humedad}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Humedad
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="humedad"
              stackId="a"
              fill={color}
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="restante"
              stackId="a"
              fill="#e5e7eb"
              className="stroke-transparent stroke-2"
              cornerRadius={5}
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Último valor registrado <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Valor entre 0% (seco) y 100% (muy húmedo)
        </div>
      </CardFooter>
    </Card>
  )
}

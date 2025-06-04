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
    const humedadRef = ref(db, "lecturas_actuales/humedad_suelo_porcentaje")
    const unsubscribe = onValue(humedadRef, (snapshot) => {
      const val = snapshot.val()
      if (typeof val === "number" && val >= 0 && val <= 100) {
        setHumedad(val)
      }
    })
    return () => unsubscribe()
  }, [])

  // Escala Terrawatch: verde → turquesa → celeste
  const getColor = (value: number) => {
    if (value >= 70) return "#6DBB74" // verde 400
    if (value >= 40) return "#5AA792" // turquesa 400
    return "#60A1B0"                 // celeste 400
  }

  const color = getColor(humedad)

  const chartData = [
    {
      humedad: humedad,
      restante: 100 - humedad,
    },
  ]

  const chartConfig = {
    restante: {
      color: "#BFDCE2", // celeste claro para la parte no llena
    },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col bg-card text-card-foreground border border-border shadow-sm transition-colors">
      <CardHeader className="items-center pb-0">
        <CardTitle>💧 Humedad del Suelo</CardTitle>
        <CardDescription className="text-muted-foreground">
          Actualizado en tiempo real
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0}
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
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
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
                          className="fill-muted-foreground text-sm"
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
              fill="#BFDCE2"
              className="stroke-transparent stroke-2"
              cornerRadius={5}
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          Último valor registrado <TrendingUp className="h-4 w-4 text-[#5AA792]" />
        </div>
        <div className="text-muted-foreground">
          Valor entre 0% (seco) y 100% (muy húmedo)
        </div>
      </CardFooter>
    </Card>
  )
}

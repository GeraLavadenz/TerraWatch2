"use client"

import * as React from "react"
import '@/lib/firebase.ts'
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
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

export function ComponentPieChart() {
  const [rainValue, setRainValue] = React.useState(0)

  React.useEffect(() => {
    const db = getDatabase()
    const rainRef = ref(db, "sensores/lluvia") // ⚠️ ajusta la ruta según tu base
    const unsubscribe = onValue(rainRef, (snapshot) => {
      const val = snapshot.val()
      if (typeof val === "number" && val >= 0 && val <= 100) {
        setRainValue(val)
      }
    })
    return () => unsubscribe()
  }, [])

  const color =
    rainValue < 30
      ? "#4ade80" // verde
      : rainValue < 70
      ? "#facc15" // amarillo
      : "#ef4444" // rojo

  const chartData = [
    { label: "Lluvia", visitors: rainValue, fill: color },
    { label: "Restante", visitors: 100 - rainValue, fill: "#e5e7eb" },
  ]

  const chartConfig = {
    lluvia: { label: "Lluvia", color },
    restante: { color: "#e5e7eb" },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Intensidad de lluvia</CardTitle>
        <CardDescription>Últimos datos en tiempo real</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="label"
              innerRadius={60}
              strokeWidth={5}
            >
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
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {rainValue}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Lluvia
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Última actualización en tiempo real <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Valor actual sobre una escala de 100%
        </div>
      </CardFooter>
    </Card>
  )
}

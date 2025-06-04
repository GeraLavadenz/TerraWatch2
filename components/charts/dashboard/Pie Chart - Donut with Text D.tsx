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
    const rainRef = ref(db, "lecturas_actuales/lluvia_porcentaje")
    const unsubscribe = onValue(rainRef, (snapshot) => {
      const val = snapshot.val()
      if (typeof val === "number" && val >= 0 && val <= 100) {
        setRainValue(val)
      }
    })
    return () => unsubscribe()
  }, [])

  // Colores HEX aplicados solo al gráfico
  const getColor = (value: number) => {
    if (value < 30) return "#6DBB74" // verde
    if (value < 70) return "#5AA792" // turquesa
    return "#60A1B0"                 // celeste
  }

  const rainColor = getColor(rainValue)

  const chartData = [
    { label: "Lluvia", visitors: rainValue, fill: rainColor },
    { label: "Restante", visitors: 100 - rainValue, fill: "#BFDCE2" },
  ]

  const chartConfig = {
    lluvia: { label: "Lluvia", color: rainColor },
    restante: { color: "#BFDCE2" },
  } satisfies ChartConfig

  return (
    <Card className="bg-card text-card-foreground border border-border shadow-sm transition-colors">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold">🌧️ Intensidad de lluvia</CardTitle>
        <CardDescription className="text-muted-foreground">
          Últimos datos en tiempo real
        </CardDescription>
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
              stroke="none"
              startAngle={180}
              endAngle={-180}
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
                          className="fill-muted-foreground text-sm"
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
       <div className="flex items-center gap-2 font-semibold text-foreground">
          Última actualización <TrendingUp className="h-4 w-4 text-[#5AA792]" />
        </div>
        <div className="text-muted-foreground">
          Valor actual sobre una escala de 100%
        </div>
      </CardFooter>
    </Card>
  )
}

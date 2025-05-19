'use client'

import { useEffect, useState } from 'react'
import { ThermometerSun } from 'lucide-react'
import {
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Label,
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import { getDatabase, ref, onValue } from 'firebase/database'
import { app } from '@/lib/firebase'

export function TemperaturaChart() {
  const [temperatura, setTemperatura] = useState(0)

  useEffect(() => {
    const db = getDatabase(app)
    const tempRef = ref(db, 'sensores/temperatura') // Ruta directa al valor
    const unsubscribe = onValue(tempRef, (snapshot) => {
      const val = snapshot.val()
      setTemperatura(parseFloat(val) || 0)
    })

    return () => unsubscribe()
  }, [])

  const chartData = [
    { name: 'Temperatura', valor: temperatura },
  ]

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Temperatura Ambiente</CardTitle>
        <CardDescription>Sensor DS18B20</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer className="mx-auto aspect-square w-full max-w-[250px]">
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
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {`${temperatura.toFixed(1)}°C`}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="valor"
              cornerRadius={5}
              fill="hsl(var(--chart-1))"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center gap-2 text-sm text-muted-foreground">
        <ThermometerSun className="h-4 w-4" />
        Temperatura actual: {temperatura.toFixed(1)}°C
      </CardFooter>
    </Card>
  )
}

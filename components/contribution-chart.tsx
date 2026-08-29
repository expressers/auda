"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { dailyRaised, formatKz, formatShortDate } from "@/lib/format"
import type { Contribution } from "@/lib/types"

const config = {
  total: { label: "Angariado", color: "var(--primary)" },
} satisfies ChartConfig

export function ContributionChart({
  contributions,
  projectId,
}: {
  contributions: Contribution[]
  projectId?: string
}) {
  const data = dailyRaised(contributions, { projectId, days: 14 }).map((item) => ({
    ...item,
    label: formatShortDate(item.date),
  }))

  return (
    <ChartContainer config={config} className="h-56 w-full">
      <LineChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={72}
          tickFormatter={(value) => `${Math.round(Number(value) / 1000)} mil`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatKz(Number(value))}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="var(--color-total)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

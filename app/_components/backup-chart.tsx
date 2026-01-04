"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  success: {
    label: "Réussies",
    color: "hsl(var(--chart-1))",
  },
  failed: {
    label: "Échouées",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type BackupChartProps = {
  data: { date: string; success: number; failed: number }[];
};

export function BackupChart({ data }: BackupChartProps) {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillSuccess" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-success)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-success)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-failed)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-failed)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="failed"
          type="natural"
          fill="url(#fillFailed)"
          fillOpacity={0.4}
          stroke="var(--color-failed)"
          stackId="a"
        />
        <Area
          dataKey="success"
          type="natural"
          fill="url(#fillSuccess)"
          fillOpacity={0.4}
          stroke="var(--color-success)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}

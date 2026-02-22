"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function ExpiryTimelineChart({
  data,
}: {
  data: { month: string; count: number }[];
}) {
  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
        No upcoming expirations
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            fontSize: "0.875rem",
          }}
          formatter={(value: number | undefined) => [value ?? 0, "Documents"]}
        />
        <Bar
          dataKey="count"
          fill="var(--primary)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

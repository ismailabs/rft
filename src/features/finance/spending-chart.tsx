"use client";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";
export function SpendingChart({
  rows,
}: {
  rows: { name: string; share: number; formatted: string }[];
}) {
  return (
    <div className="spending-chart" aria-hidden="true">
      <ResponsiveContainer width="100%" height={170}>
        <BarChart
          accessibilityLayer={false}
          data={rows.slice(0, 6)}
          margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#536660" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(_, __, item) => item.payload.formatted}
            cursor={{ fill: "#E8F1EC" }}
          />
          <Bar
            dataKey="share"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
            isAnimationActive={false}
          >
            {rows.slice(0, 6).map((r, i) => (
              <Cell key={r.name} fill={i === 0 ? "#17665E" : "#B2CEC4"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

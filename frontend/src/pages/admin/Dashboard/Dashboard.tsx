import {
  Users,
  Briefcase,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Star,
  MoreHorizontal,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  bookingTrend,
  bookingStatus,
  recentBookings,
  topProviders,
  statusStyle,
  avatarColor,
} from "./data/dashboardMockData";

interface SummaryCardProps {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
}

function SummaryCard({
  label,
  value,
  delta,
  up,
  icon,
  accent,
  iconBg,
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className={`text-3xl font-bold text-gray-900`}>{value}</span>
        <div
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}
        >
          {up ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {delta}
        </div>
      </div>
      <div className={`h-1 w-full rounded-full ${accent} opacity-30`} />
    </div>
  );
}


const renderCenterLabel = ({
  cx,
  cy,
  index,
}: any) => {
  if (index !== 0) return null;
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="central"
      className="text-2xl font-bold"
      style={{ fill: "#081D3A" }}
    >
      100%
    </text>
  );
};

export default function Dashboard() {
  const total = bookingStatus.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Welcome back, Admin </p>
        </div>
        <button 
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          style={{ backgroundColor: "#081D3A", color: "#F3F3F3" }}
        >
          View Reports <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Users"
          value="4,821"
          delta="+12.5%"
          up={true}
          icon={<Users className="w-5 h-5 text-[#F3F3F3]" />}
          accent="bg-[#081D3A]"
          iconBg="bg-[#081D3A]"
        />
        <SummaryCard
          label="Active Services"
          value="186"
          delta="+4.2%"
          up={true}
          icon={<Briefcase className="w-5 h-5 text-[#000000]" />}
          accent="bg-[#F6E304]"
          iconBg="bg-[#F6E304]"
        />
        <SummaryCard
          label="Total Bookings"
          value="1,394"
          delta="+8.7%"
          up={true}
          icon={<CalendarCheck className="w-5 h-5 text-[#F3F3F3]" />}
          accent="bg-[#17171A]"
          iconBg="bg-[#17171A]"
        />
        <SummaryCard
          label="Revenue"
          value="$38,200"
          delta="-2.1%"
          up={false}
          icon={<DollarSign className="w-5 h-5 text-[#17171A]" />}
          accent="bg-gray-200"
          iconBg="bg-gray-200"
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Line chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Bookings Overview
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Monthly bookings for 2026
              </p>
            </div>
            <span 
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ backgroundColor: "rgba(246, 227, 4, 0.3)", color: "#17171A" }}
            >
              This Year
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={bookingTrend}
              margin={{ top: 4, right: 12, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#081D3A" />
                  <stop offset="100%" stopColor="#17171A" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  fontSize: 12,
                }}
                labelStyle={{ fontWeight: 600, color: "#374151" }}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="url(#lineGrad)"
                strokeWidth={3}
                dot={{ fill: "#081D3A", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#F6E304" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800">
              Booking Status
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Distribution by status
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={bookingStatus.map((d) => ({
                    ...d,
                    value: Math.round((d.value / total) * 100),
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCenterLabel}
                >
                  {bookingStatus.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(val) => (
                    <span style={{ fontSize: 11, color: "#6B7280" }}>
                      {val}
                    </span>
                  )}
                />
                <Tooltip
                  formatter={(v) => [`${v}%`, ""]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status legend pills */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {bookingStatus.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-xs text-gray-500">{s.name}</span>
                <span className="ml-auto text-xs font-semibold text-gray-700">
                  {s.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Bookings table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Recent Bookings
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Latest 5 bookings</p>
            </div>
            <button 
              className="text-xs font-medium hover:underline flex items-center gap-1"
              style={{ color: "#081D3A" }}
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Booking ID</th>
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium hidden md:table-cell">
                    Service
                  </th>
                  <th className="pb-3 font-medium hidden lg:table-cell">
                    Date
                  </th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-3 font-mono text-xs text-gray-500">
                      {b.id}
                    </td>
                    <td className="py-3 font-medium text-gray-800">
                      {b.client}
                    </td>
                    <td className="py-3 text-gray-500 hidden md:table-cell">
                      {b.service}
                    </td>
                    <td className="py-3 text-gray-400 text-xs hidden lg:table-cell">
                      {b.date}
                    </td>
                    <td className="py-3 font-semibold text-gray-800">
                      {b.amount}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[b.status]}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-300 hover:text-gray-500 cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Service Providers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Top Providers
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">By rating & jobs</p>
            </div>
            <button 
              className="text-xs font-medium hover:underline flex items-center gap-1"
              style={{ color: "#081D3A" }}
            >
              See all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {topProviders.map((p, i) => (
              <div
                key={p.name}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* Rank */}
                <span className="text-xs font-bold text-gray-300 w-4 shrink-0">
                  {i + 1}
                </span>

                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-xs shrink-0 ${avatarColor[i]}`}
                >
                  {p.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-400">{p.specialty}</p>
                </div>

                {/* Rating & jobs */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">
                      {p.rating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{p.jobs} jobs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

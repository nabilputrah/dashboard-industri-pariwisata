"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ChartsDataService } from "@/lib/charts-data-service";
import type {
  SubsectorChartData,
  CityChartData,
  InvestmentTrendData,
} from "@/lib/charts-data-service";

const COLORS = [
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#0d9488",
  "#0891b2",
  "#0369a1",
];
const CITY_COLORS = ["#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#0d9488"];

export function ChartsSection() {
  const [subsectorData, setSubsectorData] = useState<SubsectorChartData[]>([]);
  const [cityData, setCityData] = useState<CityChartData[]>([]);
  const [investmentTrend, setInvestmentTrend] = useState<InvestmentTrendData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const years = await ChartsDataService.getAvailableYears();
        setAvailableYears(years);
        if (years.length > 0 && !years.includes(selectedYear)) {
          setSelectedYear(years[0]);
        }
      } catch (err) {
        console.error("Error fetching years:", err);
      }
    };
    fetchYears();
  }, [selectedYear]);

  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [subsector, city, trend] = await Promise.all([
          ChartsDataService.getSubsectorData(selectedYear),
          ChartsDataService.getCityData(selectedYear),
          ChartsDataService.getInvestmentTrend(selectedYear),
        ]);

        setSubsectorData(subsector);
        setCityData(city);
        setInvestmentTrend(trend);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    if (selectedYear) {
      fetchChartData();
    }
  }, [selectedYear]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-teal-200/30 bg-gradient-to-br from-white to-teal-50/50 dark:from-slate-800 dark:to-slate-700 p-6 shadow-lg">
            <div className="flex items-center justify-center h-[280px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 text-sm">Memuat grafik...</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2 rounded-lg border border-red-200/30 bg-gradient-to-br from-red-50 to-red-50/50 dark:from-slate-800 dark:to-slate-700 p-6 shadow-lg">
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Silakan periksa koneksi database
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Year Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Analisis Data Industri Pariwisata
        </h2>
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(parseInt(value))}
        >
          <SelectTrigger className="w-[120px] bg-accent text-accent-foreground">

            <SelectValue placeholder="Tahun" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-lg border border-teal-200/30 bg-gradient-to-br from-white to-teal-50/50 dark:from-slate-800 dark:to-slate-700 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Pelaku Industri Pariwisata ({selectedYear})
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={subsectorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={9}
              />
              <YAxis stroke="#64748b" />
              <Tooltip
                formatter={(value: number) => [
                  value.toLocaleString(),
                  "Jumlah Proyek",
                ]}
                labelFormatter={(label) => `Subsektor: ${label}`}
                contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px" }}
              />
              <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-teal-200/30 bg-gradient-to-br from-white to-teal-50/50 dark:from-slate-800 dark:to-slate-700 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Distribusi Investasi ({selectedYear})
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={subsectorData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                dataKey="investment"
                label={({ name, value }) =>
                  value > 0 ? `${name}: ${value.toFixed(1)} T` : ""
                }
              >
                {subsectorData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(2)} T`,
                  "Investasi (Triliun Rp)",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 minimal-card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Distribusi Geografis ({selectedYear})
          </h3>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[2000px]">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={9}
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value: number) => [
                      value.toLocaleString(),
                      "Jumlah",
                    ]}
                    labelFormatter={(label) => `Wilayah: ${label}`}
                  />
                  <Bar
                    dataKey="companies"
                    fill="#59AC77"
                    name="Proyek"
                    radius={[4, 4, 0, 0]}
                  />
                  {/* <Bar
                    dataKey="companiesB"
                    fill="#59AC77"
                    name="Proyek (40%)"
                    radius={[4, 4, 0, 0]}
                  /> */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* <div className="lg:col-span-2 minimal-card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Tren Investasi Industri Pariwisata ({selectedYear})
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={investmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="quarter" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(1)} T`,
                  "Investasi (Triliun Rp)",
                ]}
              />
              <Line
                type="monotone"
                dataKey="pma"
                stroke="#8b5cf6"
                strokeWidth={3}
                name="Total Investasi"
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="pmdn"
                stroke="#f59e0b"
                strokeWidth={3}
                name="Estimasi PMDN"
                dot={{ fill: "#f59e0b", strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div> */}
      </div>
    </div>
  );
}

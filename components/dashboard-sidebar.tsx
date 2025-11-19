"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Building2,
  Database,
  FileText,
  Globe,
  Home,
  MapPin,
  PieChart,
  Settings,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Bell,
  Moon,
  Sun
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface DashboardSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navigationItems = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    description: "Dashboard utama"
  },
  // {
  //   id: "metrics",
  //   label: "Metrics",
  //   icon: BarChart3,
  //   description: "Metrik kunci"
  // },
  {
    id: "maps",
    label: "Peta Sebaran",
    icon: MapPin,
    description: "Visualisasi geografis"
  },
  {
    id: "charts",
    label: "Analisis Grafik",
    icon: PieChart,
    description: "Grafik dan chart"
  },
  {
    id: "data-table",
    label: "Data Pelaku",
    icon: Database,
    description: "Tabel data utama"
  },
  {
    id: "regional",
    label: "Analisis Regional",
    icon: Building2,
    description: "Data per wilayah"
  },
  {
    id: "subsector",
    label: "Analisis Subsektor",
    icon: TrendingUp,
    description: "Data per subsektor"
  },
  {
    id: "investment",
    label: "Investasi",
    icon: TrendingUp,
    description: "Analisis investasi"
  },
  {
    id: "workforce",
    label: "Tenaga Kerja",
    icon: Users,
    description: "Analisis tenaga kerja"
  },
  {
    id: "ranking",
    label: "Peringkat",
    icon: FileText,
    description: "Ranking wilayah"
  },
  // {
  //   id: "haki",
  //   label: "HAKI",
  //   icon: FileText,
  //   description: "Hak Kekayaan Intelektual"
  // }
]

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <div className={cn(
      "bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 border-r border-slate-700 transition-all duration-300 flex flex-col shadow-xl",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm">Dashboard</h2>
                <p className="text-xs text-slate-400">Pariwisata Jabar</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0 hover:bg-slate-700"
          >
            {collapsed ? <ChevronRight className="w-4 h-4 text-slate-300" /> : <ChevronLeft className="w-4 h-4 text-slate-300" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10 px-3 transition-all duration-200",
                collapsed ? "px-2" : "px-3",
                activeSection === item.id && "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg hover:from-teal-700 hover:to-teal-600",
                activeSection !== item.id && "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <item.icon className={cn("w-4 h-4", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-slate-400">{item.description}</div>
                </div>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      {/* <div className="p-3 border-t border-gray-200 space-y-2">
        {!collapsed && (
          <>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn("flex-1", collapsed && "w-full")}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {!collapsed && <span className="ml-2">Theme</span>}
          </Button>
          
          {!collapsed && (
            <Button variant="ghost" size="sm" className="flex-1">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
          )}
        </div>
      </div> */}
    </div>
  )
}
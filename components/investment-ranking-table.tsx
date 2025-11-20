"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Download, Loader2, TrendingUp, Users, Building2, Search, RotateCcw } from "lucide-react"
import { RankingAnalysisService } from "@/lib/ranking-analysis-service"
import type { RankingAnalysisData } from "@/lib/ranking-analysis-types"

export function InvestmentRankingTable() {
  const [data, setData] = useState<RankingAnalysisData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const [availableYears, setAvailableYears] = useState<number[]>([])

  const pageSize = 20

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const years = await RankingAnalysisService.getAvailableYears()
        setAvailableYears(years)
        if (years.length > 0 && !years.includes(selectedYear)) {
          setSelectedYear(years[0])
        }
      } catch (err) {
        console.error('Error fetching years:', err)
      }
    }
    fetchYears()
  }, [selectedYear])

  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await RankingAnalysisService.getInvestmentRanking({
        year: selectedYear,
        page,
        limit: pageSize
      })

      setData(result.data)
      setTotalPages(result.totalPages)
      setTotalCount(result.count)
      setCurrentPage(result.currentPage)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data. Please check your database connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedYear) {
      fetchData(1)
    }
  }, [selectedYear])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchData(page)
    }
  }

  const formatCurrencyUSD = (amount: number) => {
    return `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatCurrencyIDR = (amount: number) => {
    if (amount >= 1000000000000) {
      return `Rp ${(amount / 1000000000000).toFixed(1)} T`
    } else if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)} M`
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)} Jt`
    } else {
      return `Rp ${amount.toLocaleString('id-ID')}`
    }
  }

  const exportData = async () => {
    try {
      const csvContent = [
        ['Peringkat', 'Kabupaten/Kota', 'Jumlah Proyek', 'Tambahan Investasi (US$)', 'Tambahan Investasi (Rp)'].join(','),
        ...data.map(row => [
          row.rank,
          `"${row.region}"`,
          row.project_count,
          row.investment_usd,
          row.investment_idr
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `peringkat_investasi_${selectedYear}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error exporting data:', err)
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-teal-200/30 bg-gradient-to-br from-white to-teal-50/50 dark:from-slate-800 dark:to-slate-700 shadow-lg p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchData(currentPage)} variant="outline">
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-teal-200/30 bg-gradient-to-br from-white to-teal-50/50 dark:from-slate-800 dark:to-slate-700 shadow-lg">
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Peringkat Berdasarkan Wilayah PMA/PMDN</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Data ranking investasi, penyerapan tenaga kerja, dan jumlah proyek berdasarkan kabupaten/kota di Jawa Barat
            </p>
          </div>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-[120px] border-slate-200">
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
        <Button 
          variant="outline" 
          size="sm" 
          className="text-slate-600 dark:text-slate-400 border-slate-200 bg-transparent"
          onClick={exportData}
          disabled={loading || data.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            <span className="ml-2 text-slate-600 dark:text-slate-400">Memuat data...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100">
                <TableHead className="font-medium text-slate-700 dark:text-slate-300 w-20">Peringkat</TableHead>
                <TableHead className="font-medium text-slate-700 dark:text-slate-300">Kabupaten/Kota</TableHead>
                <TableHead className="font-medium text-slate-700 dark:text-slate-300">Sum of Proyek</TableHead>
                <TableHead className="font-medium text-slate-700 dark:text-slate-300">Sum of Tambahan Investasi (Dalam US$)</TableHead>
                <TableHead className="font-medium text-slate-700 dark:text-slate-300">Sum of Tambahan Investasi (Dalam Rp)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400">
                    Tidak ditemukan data
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {data.map((row) => (
                    <TableRow key={row.id} className="border-slate-100 hover:bg-slate-50 dark:bg-slate-900">
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {row.rank}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 dark:text-white">{row.region}</TableCell>
                      <TableCell className="font-medium text-teal-600">{row.project_count.toLocaleString()}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrencyUSD(row.investment_usd)}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrencyIDR(row.investment_idr)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Grand Total Row */}
                  <TableRow className="border-t-2 border-slate-300 bg-slate-50 dark:bg-slate-900 font-bold">
                    <TableCell className="text-center">
                      <Badge variant="default" className="bg-gray-700 text-white">
                        Total
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900 dark:text-white">Grand Total</TableCell>
                    <TableCell className="font-bold text-blue-700">
                      {data.reduce((sum, item) => sum + item.project_count, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold text-green-700">
                      {formatCurrencyUSD(data.reduce((sum, item) => sum + item.investment_usd, 0))}
                    </TableCell>
                    <TableCell className="font-bold text-green-700">
                      {formatCurrencyIDR(data.reduce((sum, item) => sum + item.investment_idr, 0))}
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {!loading && data.length > 0 && (
        <div className="flex items-center justify-between p-6 border-t border-slate-100">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Menampilkan {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} dari {totalCount.toLocaleString()} data
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="text-slate-600 dark:text-slate-400 border-slate-200 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </Button>
            <span className="text-sm text-slate-600 dark:text-slate-400 px-3">
              Halaman {currentPage} dari {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="text-slate-600 dark:text-slate-400 border-slate-200 bg-transparent"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
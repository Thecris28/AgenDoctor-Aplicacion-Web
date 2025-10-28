
'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, DollarSign, FileText, TrendingUp, Download, Filter, Eye, Search } from 'lucide-react'
import { useUserData } from '@/hooks/useUserData'

interface Boleta {
  id: number
  numeroFactura: string
  fechaEmision: string
  paciente: {
    nombre: string
    rut: string
  }
  consulta: {
    fecha: string
    tipo: string
    duracion: number
  }
  monto: number
  estado: 'pagada' | 'pendiente' | 'vencida'
  metodoPago?: string
  observaciones?: string
}

interface EstadisticasReporte {
  totalIngresos: number
  totalConsultas: number
  promedioMensual: number
  consultasPorTipo: { tipo: string; cantidad: number; monto: number }[]
}

type PeriodoFiltro = 'semana' | 'mes' | 'trimestre' | 'año' | 'personalizado'

export default function ReportesPage() {
  const { userData } = useUserData()
  const [boletas, setBoletas] = useState<Boleta[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasReporte | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [periodoFiltro, setPeriodoFiltro] = useState<PeriodoFiltro>('mes')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<string>('todas')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Estados UI
  const [selectedBoleta, setSelectedBoleta] = useState<Boleta | null>(null)
  const [showDetalleModal, setShowDetalleModal] = useState(false)

  useEffect(() => {
    loadReportes()
  }, [userData?.idPsicologo, periodoFiltro, fechaInicio, fechaFin, estadoFiltro])

  const loadReportes = async () => {
    if (!userData?.idPsicologo) return
    loadMockData()
    
    setLoading(true)
    try {
      // // Aquí conectarías con tu backend
      // const response = await fetch(`/api/reportes/boletas?psicologoId=${userData.idPsicologo}&periodo=${periodoFiltro}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&estado=${estadoFiltro}`)
      // const data = await response.json()
      
      // setBoletas(data.boletas)
      // setEstadisticas(data.estadisticas)
    } catch (error) {
      console.error('Error loading reportes:', error)
      // Datos simulados para desarrollo
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    const mockBoletas: Boleta[] = [
      {
        id: 1,
        numeroFactura: 'FAC-2025-001',
        fechaEmision: '2025-10-21',
        paciente: { nombre: 'María García', rut: '12.345.678-9' },
        consulta: { fecha: '2025-10-21', tipo: 'Terapia Individual', duracion: 60 },
        monto: 45000,
        estado: 'pagada',
        metodoPago: 'Transferencia',
        observaciones: 'Sesión de seguimiento'
      },
      {
        id: 2,
        numeroFactura: 'FAC-2025-002',
        fechaEmision: '2025-10-20',
        paciente: { nombre: 'Carlos Rodríguez', rut: '98.765.432-1' },
        consulta: { fecha: '2025-10-20', tipo: 'Terapia de Pareja', duracion: 90 },
        monto: 60000,
        estado: 'pagada',
        metodoPago: 'Efectivo'
      },
      {
        id: 3,
        numeroFactura: 'FAC-2025-003',
        fechaEmision: '2025-10-19',
        paciente: { nombre: 'Ana López', rut: '11.222.333-4' },
        consulta: { fecha: '2025-10-19', tipo: 'Evaluación Psicológica', duracion: 120 },
        monto: 80000,
        estado: 'pendiente',
        observaciones: 'Pendiente de pago'
      }
    ]

    const mockEstadisticas: EstadisticasReporte = {
      totalIngresos: 185000,
      totalConsultas: 3,
      promedioMensual: 185000,
      consultasPorTipo: [
        { tipo: 'Terapia Individual', cantidad: 1, monto: 45000 },
        { tipo: 'Terapia de Pareja', cantidad: 1, monto: 60000 },
        { tipo: 'Evaluación Psicológica', cantidad: 1, monto: 80000 }
      ]
    }

    setBoletas(mockBoletas)
    setEstadisticas(mockEstadisticas)
  }

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pagada': return 'bg-green-100 text-green-800'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'vencida': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const boletasFiltradas = boletas.filter(boleta => {
    const matchesSearch = boleta.paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         boleta.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = estadoFiltro === 'todas' || boleta.estado === estadoFiltro
    return matchesSearch && matchesEstado
  })

  const exportarReporte = () => {
    // Implementar exportación a PDF/Excel
    console.log('Exportando reporte...')
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reportes Financieros</h1>
        <p className="text-gray-600">Gestión de boletas y consultas pagadas</p>
      </div>

      {/* Estadísticas Resumen */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{formatMonto(estadisticas.totalIngresos)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Consultas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalConsultas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Promedio Mensual</p>
                <p className="text-2xl font-bold text-gray-900">{formatMonto(estadisticas.promedioMensual)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Consultas por Mes</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(estadisticas.totalConsultas / 1)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y Controles */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
              <select
                value={periodoFiltro}
                onChange={(e) => setPeriodoFiltro(e.target.value as PeriodoFiltro)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="semana">Esta semana</option>
                <option value="mes">Este mes</option>
                <option value="trimestre">Este trimestre</option>
                <option value="año">Este año</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>

            {/* Fechas personalizadas */}
            {periodoFiltro === 'personalizado' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </>
            )}

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="todas">Todas</option>
                <option value="pagada">Pagadas</option>
                <option value="pendiente">Pendientes</option>
                <option value="vencida">Vencidas</option>
              </select>
            </div>

            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Paciente o N° factura..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Exportar */}
          <button
            onClick={exportarReporte}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Tabla de Boletas */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Boletas y Facturas</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Factura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Consulta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo Consulta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </td>
                </tr>
              ) : boletasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron boletas para los filtros seleccionados
                  </td>
                </tr>
              ) : (
                boletasFiltradas.map((boleta) => (
                  <tr key={boleta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {boleta.numeroFactura}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{boleta.paciente.nombre}</div>
                      <div className="text-sm text-gray-500">{boleta.paciente.rut}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(boleta.consulta.fecha).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{boleta.consulta.tipo}</div>
                      <div className="text-sm text-gray-500">{boleta.consulta.duracion} min</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatMonto(boleta.monto)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(boleta.estado)}`}>
                        {boleta.estado.charAt(0).toUpperCase() + boleta.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedBoleta(boleta)
                          setShowDetalleModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico de Consultas por Tipo */}
      {estadisticas && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultas por Tipo</h3>
          <div className="space-y-4">
            {estadisticas.consultasPorTipo.map((tipo, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded mr-3 bg-blue-${(index + 1) * 200}`}></div>
                  <span className="text-sm font-medium text-gray-700">{tipo.tipo}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{formatMonto(tipo.monto)}</div>
                  <div className="text-xs text-gray-500">{tipo.cantidad} consultas</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Detalle (opcional) */}
      {showDetalleModal && selectedBoleta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Detalle de Factura</h3>
                <button
                  onClick={() => setShowDetalleModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="font-medium">N° Factura:</span> {selectedBoleta.numeroFactura}
                </div>
                <div>
                  <span className="font-medium">Paciente:</span> {selectedBoleta.paciente.nombre}
                </div>
                <div>
                  <span className="font-medium">Monto:</span> {formatMonto(selectedBoleta.monto)}
                </div>
                <div>
                  <span className="font-medium">Estado:</span> {selectedBoleta.estado}
                </div>
                {selectedBoleta.metodoPago && (
                  <div>
                    <span className="font-medium">Método de Pago:</span> {selectedBoleta.metodoPago}
                  </div>
                )}
                {selectedBoleta.observaciones && (
                  <div>
                    <span className="font-medium">Observaciones:</span> {selectedBoleta.observaciones}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDetalleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Descargar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
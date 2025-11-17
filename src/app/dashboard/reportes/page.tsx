
'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, DollarSign, FileText, TrendingUp, Download, Eye, Search, ChevronDown, X } from 'lucide-react'
import { useUserData } from '@/hooks/useUserData'
import { getBillingInfo } from '@/services/psicologoService'

export interface Reporte {
  factura:         string;
  fecha:           Date;
  monto:           string;
  TipoEstadoPago:  string;
  rut:             string;
  PrimerNombre:    string;
  ApellidoPaterno: string;
  metodo_pago?:    string;
}


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
  consultasPorTipo?: { tipo: string; cantidad: number; monto: number }[]
}

type PeriodoFiltro = 'semana' | 'mes' | 'trimestre' | 'año' | 'personalizado'

export default function ReportesPage() {
  const { userData } = useUserData()

  const [boletas, setBoletas] = useState<Reporte[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasReporte | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [periodoFiltro, setPeriodoFiltro] = useState<PeriodoFiltro>('mes')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<string>('todas')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Estados UI
  const [selectedBoleta, setSelectedBoleta] = useState<Reporte | null>(null)
  const [showDetalleModal, setShowDetalleModal] = useState(false)

  const nombreEspecialidad = userData?.especialidad || 'Especialidad Desconocida'

   // Debug: Ver qué datos tenemos
  console.log('userData completo:', userData)
  console.log('especialidad:', userData?.especialidad)

  useEffect(() => {
    loadReportes()
  }, [userData?.idPsicologo, periodoFiltro, fechaInicio, fechaFin, estadoFiltro])

  const loadReportes = async () => {
    if (!userData?.idPsicologo) return
    
    
    setLoading(true)
    try {
      
      const response = await getBillingInfo(userData.idPsicologo)
      setBoletas(response)
      setEstadisticas(calcularEstadisticas(response))
      console.log('Datos de facturación recibidos:', response)
    } catch (error) {
      console.error('Error loading reportes:', error)
      // Datos simulados para desarrollo
    } finally {
      setLoading(false)
    }
  }
  const calcularEstadisticas = (boletas: Reporte[]) => {
    const totalIngresos = boletas.reduce((sum, boleta) => sum + parseFloat(boleta.monto), 0)
    const totalConsultas = boletas.length
    const promedioMensual = totalConsultas > 0 ? totalIngresos / (totalConsultas / 1) : 0 // Asumiendo datos de 1 mes

    return {
      totalIngresos,
      totalConsultas,
      promedioMensual
    }
  }


  //   const mockEstadisticas: EstadisticasReporte = {
  //     totalIngresos: 185000,
  //     totalConsultas: 3,
  //     promedioMensual: 185000,
  //     consultasPorTipo: [
  //       { tipo: 'Terapia Individual', cantidad: 1, monto: 45000 },
  //       { tipo: 'Terapia de Pareja', cantidad: 1, monto: 60000 },
  //       { tipo: 'Evaluación Psicológica', cantidad: 1, monto: 80000 }
  //     ]
  //   }

  //   setBoletas(mockBoletas)
  //   setEstadisticas(mockEstadisticas)
  // }

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pagado': return 'bg-green-100 text-green-800'
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'Vencida': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const boletasFiltradas = boletas.filter(boleta => {
    const matchesSearch = boleta.PrimerNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         boleta.factura.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = estadoFiltro === 'todas' || boleta.TipoEstadoPago === estadoFiltro
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
          <div className="bg-white p-6 rounded-lg border border-gray-300">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{formatMonto(estadisticas.totalIngresos)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-300">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Consultas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.totalConsultas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-300">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Promedio Mensual</p>
                <p className="text-2xl font-bold text-gray-900">{formatMonto(estadisticas.promedioMensual)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-300">
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
      <div className="bg-white p-6 rounded-lg mb-6 border border-gray-300">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
              <div className='grid grid-cols-1 shrink-0 focus-within:relative'>
                <select
                value={periodoFiltro}
                onChange={(e) => setPeriodoFiltro(e.target.value as PeriodoFiltro)}
                className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
              >
                <option value="semana">Esta semana</option>
                <option value="mes">Este mes</option>
                <option value="trimestre">Este trimestre</option>
                <option value="año">Este año</option>
                <option value="personalizado">Personalizado</option>
              </select>
              <ChevronDown className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />

              </div>
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
                    className="rounded-lg px-3 py-2 text-sm outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="rounded-lg px-3 py-2 text-sm
                  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
                  />
                </div>
              </>
            )}

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <div className='grid grid-cols-1 shrink-0 focus-within:relative'>
                <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
              >
                <option value="todas">Todas</option>
                <option value="pagada">Pagadas</option>
                <option value="pendiente">Pendientes</option>
                <option value="vencida">Vencidas</option>
              </select>
              <ChevronDown className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />

              </div>
              
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
                  className="pl-10 rounded-lg px-3 py-2 text-sm
                  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500"
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
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
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
                boletasFiltradas.map((boleta, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {boleta.factura}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{boleta.PrimerNombre} {boleta.ApellidoPaterno}</div>
                      <div className="text-sm text-gray-500">{boleta.rut}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(boleta.fecha).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{nombreEspecialidad}</div>
                      <div className="text-sm text-gray-500">60 min</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatMonto(+boleta.monto)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(boleta.TipoEstadoPago)}`}>
                        {boleta.TipoEstadoPago}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedBoleta( boleta)
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
      {/* {estadisticas && (
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
      )} */}

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
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="font-medium">N° Factura:</span> {selectedBoleta.factura}
                </div>
                <div>
                  <span className="font-medium">Paciente:</span> {selectedBoleta.PrimerNombre} {selectedBoleta.ApellidoPaterno} ({selectedBoleta.rut})
                </div>
                <div>
                  <span className="font-medium">Monto:</span> {Number(selectedBoleta.monto).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </div>
                <div>
                  <span className="font-medium">Estado:</span> {selectedBoleta.TipoEstadoPago}
                </div>
                
                  <div>
                    <span className="font-medium">Fecha de Pago:</span> {String(selectedBoleta.fecha).split('T')[0]}
                  </div>
                  <div>
                    <span className="font-medium">Método de Pago:</span> {selectedBoleta.metodo_pago || 'N/A'}
                  </div>
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
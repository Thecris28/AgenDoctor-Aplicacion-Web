"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  MoreHorizontal,
  Edit,
  ChevronDownIcon,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import {
  getPsychologistAppointments,
  updateAppointment,
} from "@/services/psicologoService";
import { PsychologistAppointments } from "@/interfaces/psychologist";
import CitaModal from "@/components/CitaModal";
import { useRouter } from "next/navigation";

type FilterType = "todas" | "hoy" | "semana" | "mes";
type StatusFilter =
  | "todas"
  | "Programada"
  | "Completada"
  | "Cancelada"
  | "No Asistió";

export default function CitasPage() {
  const { userData, isLoading } = useUserData();
  const [citas, setCitas] = useState<PsychologistAppointments[]>([]);
  const [filteredCitas, setFilteredCitas] = useState<
    PsychologistAppointments[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<FilterType>("todas");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todas");
  const router = useRouter();

  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCita, setSelectedCita] =
    useState<PsychologistAppointments | null>(null);
  // Estados para la paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Cálculos de paginación
  const totalItems = filteredCitas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCitas = filteredCitas.slice(startIndex, endIndex);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, statusFilter]);

  // Funciones de paginación
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Generar números de página visibles
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(currentPage - halfVisible, 1);
      const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }
    }
    
    return visiblePages;
  };

  useEffect(() => {
    const fetchCitas = async () => {
      setLoading(true);
      if (!userData?.idPsicologo) return;
      try {
        const response = await getPsychologistAppointments(
          userData?.idPsicologo
        );
        setCitas(response);
        console.log("Citas fetched:", response);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.idPsicologo) {
      fetchCitas();
    }
  }, [userData?.idPsicologo]);

  // Filtrar citas
  useEffect(() => {
    let filtered = citas;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter((cita) =>
        cita.paciente.nombreCompleto
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por fecha
    const today = new Date();
    const todayStr = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");
    console.log("Applying date filter:", todayStr);

    switch (dateFilter) {
      case "hoy":
        filtered = filtered.filter(
          (cita) => String(cita.fechaCita) === todayStr
        );
        break;
      case "semana":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        filtered = filtered.filter((cita) => {
          const citaDate = new Date(cita.fechaCita);
          return citaDate >= weekStart && citaDate <= weekEnd;
        });
        break;
      case "mes":
        filtered = filtered.filter((cita) => {
          const citaDate = new Date(cita.fechaCita);
          return (
            citaDate.getMonth() === today.getMonth() &&
            citaDate.getFullYear() === today.getFullYear()
          );
        });
        break;
    }

    // Filtro por estado
    if (statusFilter !== "todas") {
      filtered = filtered.filter((cita) => cita.estado_cita === statusFilter);
    }

    setFilteredCitas(filtered);
  }, [citas, searchTerm, dateFilter, statusFilter]);

  const formatFecha = (fecha: string) => {
    const [year, month, day] = fecha.split("-").map(Number);
    // Si el formato es YYYY-MM-DD
    if (year && month && day) {
      const localDate = new Date(year, month - 1, day);
      return localDate.toLocaleDateString("es-CL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Programada":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "En Curso":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "Completada":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Cancelada":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "No Asistió":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Programada":
        return "bg-blue-100 text-blue-800";
      case "En Curso":
        return "bg-orange-100 text-orange-800";
      case "Completada":
        return "bg-green-100 text-green-800";
      case "Cancelada":
        return "bg-red-100 text-red-800";
      case "No Asistió":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleOpenModal = (cita: PsychologistAppointments) => {
    setSelectedCita(cita);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCita(null);
  };

  const mapEstadoCita = (estado: string) => {
    switch (estado) {
      case "Programada":
        return 1;
      case "Confirmada":
        return 2;
      case "En Curso":
        return 3;
      case "Completada":
        return 4;
      case "Cancelada":
        return 5;
      case "No Asistió":
        return 6;
      default:
        return 0;
    }
  };

  const handleSaveCita = async (
    citaId: number,
    data: { diagnostico: string; tratamiento: string; estado_cita: string }
  ) => {
    console.log("Actualizando cita:", citaId, data);

    updateAppointment({
      IdCita: citaId,
      Diagnostico: data.diagnostico,
      Tratamiento: data.tratamiento,
      idEstadoCita: mapEstadoCita(data.estado_cita),
    });

    // Actualizar el estado local
    setCitas((prev) =>
      prev.map((cita) =>
        cita.idCita === citaId
          ? {
            ...cita,
            diagnostico: data.diagnostico,
            tratamiento: data.tratamiento,
            estado_cita: data.estado_cita,
          }
          : cita
      )
    );

    // Mostrar mensaje de éxito (opcional)
    alert("Cita actualizada exitosamente");
  };

  const handleRouter = () => {
    router.push('/dashboard/message');
  }

  const handleStatusChange = (citaId: number, newStatus: string) => {
    setCitas((prev) =>
      prev.map((cita) =>
        cita.idCita === citaId
          ? { ...cita, estado_cita: newStatus as any }
          : cita
      )
    );
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen p-6 pt-12 md:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-12 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Citas</h1>
        <p className="text-gray-600">Gestiona tus citas con pacientes</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl border border-gray-300 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md w-full ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            <input
              type="text"
              placeholder="Buscar por paciente..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
              text-base text-gray-500 placeholder:text-gray-400 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            <div className="grid shrink-0 grid-cols-1 focus-within:relative">
              <select
              className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 outline-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as FilterType)}
            >
              <option value="todas">Todas las fechas</option>
              <option value="hoy">Hoy</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
            </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </div>
            
            <div className="grid shrink-0 grid-cols-1 focus-within:relative">
              <select
                className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 outline-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6
              "
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              >
                <option value="todas">Todos los estados</option>
                <option value="Programada">Programadas</option>
                <option value="Completada">Completadas</option>
                <option value="Cancelada">Canceladas</option>
                <option value="No Asistió">No Asistió</option>
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />

            </div>
            <div className="flex items-center gap-2">
  <span className="text-sm text-gray-600">Mostrar:</span>
  <select
    value={itemsPerPage}
    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
    className="px-2 py-1 border border-gray-300 rounded text-sm"
  >
    <option value={5}>5</option>
    <option value={10}>10</option>
    <option value={20}>20</option>
    <option value={50}>50</option>
  </select>
</div>

          </div>
        </div>
      </div>

      {/* Información de resultados */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} resultados
        </div>
        {totalItems > 0 && (
          <div className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white hover:bg-backgroundCard hover:border-blue-300 py-4 px-2 rounded-xl border border-gray-300">
          <div className="flex items-center">

            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Citas para hoy</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  citas.filter(
                    (c) =>
                      String(c.fechaCita) === new Date().toISOString().split("T")[0]
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white hover:bg-backgroundCard hover:border-blue-300 p-4 rounded-xl border border-gray-300">
          <div className="flex items-center">

            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {citas.filter((c) => c.estado_cita === "Completada").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white hover:bg-backgroundCard hover:border-blue-300 p-4 rounded-xl border border-gray-300">
          <div className="flex items-center">

            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {citas.filter((c) => c.estado_cita === "Programada").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white hover:bg-backgroundCard hover:border-blue-300 p-4 rounded-xl border border-gray-300">
          <div className="flex items-center">

            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Citas</p>
              <p className="text-2xl font-bold text-gray-900">{citas.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de citas - usando currentCitas en lugar de filteredCitas */}
      <div className="space-y-4">
        {currentCitas.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-300 p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay citas
            </h3>
            <p className="text-gray-600">
              No se encontraron citas con los filtros seleccionados.
            </p>
          </div>
        ) : (
          currentCitas.map((cita) => (
            <div
              key={cita.idCita}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* ...existing cita content... */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 min-w-10 rounded-full bg-blue-500 flex text-2xl justify-center text-white font-medium">
                        {cita.paciente.nombreCompleto.split(" ").join("").charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {cita.paciente.nombreCompleto}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {cita.paciente.edad ? `${cita.paciente.edad} años` : "Edad no especificada"}
                        </p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex gap-1 w-fit ${getEstadoColor(cita.estado_cita)}`}>
                      {getEstadoIcon(cita.estado_cita)}
                      {cita.estado_cita.charAt(0).toUpperCase() + cita.estado_cita.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="col-span-2 flex items-center">
                      <Calendar className="h-4 w-4 min-w-4 mr-2" />
                      <span>{formatFecha(String(cita.fechaCita))}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{cita.horaCita}</span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleOpenModal(cita)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Actualizar
                  </button>

                  <button 
                    onClick={() => handleRouter()} 
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Mensaje
                  </button>

                  <div className="relative group">
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      {cita.estado_cita === "programada" && (
                        <button
                          onClick={() => handleStatusChange(cita.idCita, "completada")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Marcar como completada
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(cita.idCita, "cancelada")}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Cancelar cita
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Ver historial del paciente
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Información de paginación */}
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} resultados
          </div>

          {/* Controles de navegación */}
          <div className="flex items-center gap-2">
            {/* Botón anterior */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            {/* Números de página */}
            <div className="flex items-center gap-1">
              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Botón siguiente */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Ir a página específica */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Ir a página:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Number(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  goToPage(page);
                }
              }}
              className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Modal para actualizar cita */}
      <CitaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        cita={selectedCita}
        onSave={handleSaveCita}
      />
    </div>
  );
}

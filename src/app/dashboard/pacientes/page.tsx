'use client'
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react';

interface Patient {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rut: string;
  fechaRegistro: string;
  ultimaCita: string;
  estado: 'Activo' | 'Inactivo';
  avatar?: string;
}

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo (reemplaza con tu API)
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: '1',
        nombre: 'María González',
        email: 'maria.gonzalez@email.com',
        telefono: '+56 9 1234 5678',
        rut: '12.345.678-9',
        fechaRegistro: '15 Mar 2024',
        ultimaCita: '10 Oct 2024',
        estado: 'Activo',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
      },
      {
        id: '2',
        nombre: 'Carlos Mendoza',
        email: 'carlos.mendoza@email.com',
        telefono: '+56 9 8765 4321',
        rut: '18.765.432-1',
        fechaRegistro: '20 Mar 2024',
        ultimaCita: '08 Oct 2024',
        estado: 'Activo',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
      },
      {
        id: '3',
        nombre: 'Ana Soto',
        email: 'ana.soto@email.com',
        telefono: '+56 9 5555 1234',
        rut: '15.555.123-4',
        fechaRegistro: '25 Mar 2024',
        ultimaCita: '05 Oct 2024',
        estado: 'Inactivo',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
      },
      {
        id: '4',
        nombre: 'Pedro Ramírez',
        email: 'pedro.ramirez@email.com',
        telefono: '+56 9 9999 8888',
        rut: '19.999.888-8',
        fechaRegistro: '30 Mar 2024',
        ultimaCita: '02 Oct 2024',
        estado: 'Inactivo',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
      },
      {
        id: '5',
        nombre: 'Laura Herrera',
        email: 'laura.herrera@email.com',
        telefono: '+56 9 7777 6666',
        rut: '17.777.666-6',
        fechaRegistro: '05 Abr 2024',
        ultimaCita: '01 Oct 2024',
        estado: 'Activo',
        avatar: 'https://randomuser.me/api/portraits/women/5.jpg'
      },
      {
        id: '6',
        nombre: 'Diego Torres',
        email: 'diego.torres@email.com',
        telefono: '+56 9 3333 2222',
        rut: '13.333.222-2',
        fechaRegistro: '10 Abr 2024',
        ultimaCita: '28 Sep 2024',
        estado: 'Activo',
        avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
      }
    ];

    setTimeout(() => {
      setPatients(mockPatients);
      setFilteredPatients(mockPatients);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar pacientes
  useEffect(() => {
    let filtered = patients;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.rut.includes(searchTerm) ||
        patient.telefono.includes(searchTerm)
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => patient.estado.toLowerCase() === statusFilter);
    }

    setFilteredPatients(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, patients]);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Activo': 'bg-green-100 text-green-800',
      'Inactivo': 'bg-red-100 text-red-800',
    };
    return statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Pacientes</h1>
          <p className="text-gray-600">Gestiona y consulta la información de tus pacientes</p>
        </div>
        
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Buscador */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, email, RUT o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">No</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">RUT</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Nombre del Paciente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha de Registro</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Última Cita</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading skeleton
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b border-gray-100 animate-pulse">
                    <td className="py-4 px-4">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-8 h-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="w-32 h-4 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : currentPatients.length > 0 ? (
                currentPatients.map((patient, index) => (
                  <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {patient.rut}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {patient.avatar ? (
                          <img
                            src={patient.avatar}
                            alt={patient.nombre}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-medium">
                            {getInitials(patient.nombre)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{patient.nombre}</div>
                          <div className="text-sm text-gray-500">{patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {patient.fechaRegistro}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {patient.ultimaCita}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(patient.estado)}`}>
                        {patient.estado}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1">
                        <button className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center hover:bg-teal-600 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={48} className="text-gray-300" />
                      <p>No se encontraron pacientes</p>
                      <p className="text-sm">Intenta con otros términos de búsqueda</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredPatients.length)} de {filteredPatients.length} pacientes
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentPage === page
                          ? 'bg-teal-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-1">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

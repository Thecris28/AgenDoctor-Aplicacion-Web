'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Users, MessageSquare, TrendingUp, Star, Activity } from 'lucide-react'
import { useUserData } from '@/hooks/useUserData'
import { getPsychologistAppointments } from '@/services/psicologoService'

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingMessages: number;
  weeklyAppointments: number;
  averageRating: number;
  completedSessions: number;
}

export default function InicioPage() {
  const { userData, isLoading } = useUserData();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    pendingMessages: 0,
    weeklyAppointments: 0,
    averageRating: 0,
    completedSessions: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userData?.idusuario) return;
      
      try {
        // Obtener citas del psicólogo
        const appointments = await getPsychologistAppointments(userData.idusuario);
        
        // Calcular estadísticas
        const today = new Date().toDateString();
        const todayAppointments = appointments.filter((apt: any) => 
          new Date(apt.fechaCita).toDateString() === today
        ).length;

        const thisWeek = getThisWeekAppointments(appointments);
        
        setStats({
          totalPatients: appointments.length > 0 ? new Set(appointments.map((apt: any) => apt.idPaciente)).size : 0,
          todayAppointments,
          pendingMessages: Math.floor(Math.random() * 10), // Placeholder
          weeklyAppointments: thisWeek,
          averageRating: 4.8, // Placeholder
          completedSessions: appointments.filter((apt: any) => apt.estado === 'Completada').length
        });

        setRecentAppointments(appointments.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userData]);

  const getThisWeekAppointments = (appointments: any[]) => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    return appointments.filter((apt: any) => {
      const aptDate = new Date(apt.fechaCita);
      return aptDate >= startOfWeek;
    }).length;
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header de Bienvenida */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Bienvenido de vuelta, Dr. {userData?.nombre}!
        </h1>
        <p className="text-gray-600">
          Aquí tienes un resumen de tu actividad de hoy
        </p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Citas Hoy</p>
              <p className="text-3xl font-bold text-blue-600">{stats.todayAppointments}</p>
            </div>
            <Calendar className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pacientes</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalPatients}</p>
            </div>
            <Users className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mensajes Pendientes</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingMessages}</p>
            </div>
            <MessageSquare className="h-12 w-12 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sesiones Completadas</p>
              <p className="text-3xl font-bold text-purple-600">{stats.completedSessions}</p>
            </div>
            <Activity className="h-12 w-12 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Citas Próximas */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Próximas Citas</h2>
          </div>
          <div className="p-6">
            {recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {recentAppointments.map((appointment: any, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.nombrePaciente}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.fechaCita).toLocaleDateString()} - {appointment.horaCita}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.estado === 'Programada' ? 'bg-green-100 text-green-800' : 
                      appointment.estado === 'Completada' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.estado}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No tienes citas programadas</p>
            )}
          </div>
        </div>

        {/* Panel de Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Acciones Rápidas</h2>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium">Ver Agenda</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">Mensajes</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600 font-medium">Mis Pacientes</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-orange-600 font-medium">Configurar Horarios</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas Adicionales */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento Semanal</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.weeklyAppointments}</p>
              <p className="text-sm text-gray-600">Citas esta semana</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calificación Promedio</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.averageRating}</p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(stats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
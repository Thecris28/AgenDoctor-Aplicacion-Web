'use client'
import { Home, User, Calendar, Users, Settings, FileText, LogOut, BookOpen, ClipboardList, Clock, MessageSquare, HeartPulse, Award, Activity } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export default function Sidebar() {
  const router = useRouter();
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  
  // Extraer la sección activa de la ruta
  const section = pathname?.split('/').pop() || 'inicio';
  const [activeSection, setActiveSection] = useState(section);
  
  // Verificar cuando el usuario esté cargado
  useEffect(() => {
    // Pequeño retraso para asegurarse que el store está hidratado
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Actualizar la sección activa cuando cambia la ruta
  useEffect(() => {
    const currentSection = pathname?.split('/').pop() || 'inicio';
    setActiveSection(currentSection);
  }, [pathname]);
  
  // Menú para psicólogos
  const psychologistMenu = [
    { id: 'inicio', label: 'Inicio', icon: Home, href: '/dashboard/inicio' },
    { id: 'citas', label: 'Citas', icon: Calendar, href: '/dashboard/citas' },
    { id: 'pacientes', label: 'Pacientes', icon: Users, href: '/dashboard/pacientes' },
    { id: 'agenda', label: 'Mi Agenda', icon: Clock, href: '/dashboard/agenda' },
    { id: 'reportes', label: 'Informes', icon: FileText, href: '/dashboard/reportes' },
    { id: 'mensajes', label: 'Mensajes', icon: MessageSquare, href: '/dashboard/mensajes' },
    { id: 'perfil', label: 'Mi Perfil', icon: User, href: '/dashboard/perfil' },
    { id: 'ajustes', label: 'Ajustes', icon: Settings, href: `/dashboard/ajustes?id=${user?.idPsicologo}` },
  ];
  
  // Menú para pacientes
  const patientMenu = [
    // { id: 'inicio', label: 'Inicio', icon: Home, href: '/dashboard/inicio' },
    { id: 'agendamiento', label: 'Agendar Cita', icon: Calendar, href: '/appointment/appointment' },
    { id: 'mis-citas', label: 'Mis Citas', icon: Clock, href: '/appointment/misCitas' },
    { id: 'profesionales', label: 'Profesionales', icon: HeartPulse, href: '/appointment/profesionales' },
    { id: 'mensajes', label: 'Mensajes', icon: MessageSquare, href: '/appointment/mensajes' },
    { id: 'configuracion', label: 'Configuración', icon: Settings, href: '/appointment/configuracion' },
  ];
  
  // Menú para administradores
  const adminMenu = [
    { id: 'inicio', label: 'Dashboard', icon: Home, href: '/dashboard/inicio' },
    { id: 'usuarios', label: 'Usuarios', icon: Users, href: '/dashboard/usuarios' },
    { id: 'psicologos', label: 'Psicólogos', icon: Award, href: '/dashboard/psicologos' },
    { id: 'pacientes', label: 'Pacientes', icon: HeartPulse, href: '/dashboard/pacientes' },
    { id: 'citas', label: 'Citas', icon: Calendar, href: '/dashboard/citas' },
    { id: 'reportes', label: 'Reportes', icon: Activity, href: '/dashboard/reportes' },
    { id: 'configuracion', label: 'Configuración', icon: Settings, href: '/dashboard/configuracion' },
  ];
  
  // Seleccionar el menú según el rol del usuario
  const getMenuItems = () => {
    if (!user) return patientMenu; // Por defecto muestra el menú de paciente si no hay usuario
    
    switch (user.role) {
      case 'psychologist':
        return psychologistMenu;
      case 'admin':
        return adminMenu;
      case 'patient':
      default:
        return patientMenu;
    }
  };
  
  const menuItems = getMenuItems();

  const handleLogout = () => {
    // Limpiar datos del usuario
    localStorage.removeItem('token');
    // Si usas store de Zustand
    // clearProfesional();
    
    // Redirigir a la página principal
    router.push('/');
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Función para cerrar el sidebar al hacer clic en un enlace (en móvil)
  const handleLinkClick = (id: string) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };
  
  // Mostrar un placeholder mientras se carga
  if (isLoading) {
    return (
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 hidden md:block">
        <div className="h-full px-6 py-4 overflow-y-auto flex flex-col">
          {/* Skeleton loader para el header */}
          <div className="pb-4 mb-4 border-b border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="ml-3 space-y-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Skeleton loader para menú items */}
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-14 w-full bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </aside>
    );
  }
  
  return (
    <>
      {/* Botón para abrir el sidebar en móvil */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed md:hidden top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md"
        aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      
      <aside 
        id="default-sidebar" 
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`} 
        aria-label="Sidebar"
      >
        <div className="h-full px-6 py-4 overflow-y-auto bg-white border-r border-gray-200 flex flex-col">
          {/* Header del sidebar con info del usuario */}
          <div className="pb-4 mb-4 border-b border-gray-200">
            <div className="grid grid-cols-4 items-center mb-3">
              <div className="col-span-1 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="ml-3 col-span-3">
                <p className="text-sm font-medium text-gray-900 truncate ">
                  {user?.email || 'Usuario'}
                </p>
                 {/* Etiqueta de rol */}
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user?.role === 'psychologist' 
                ? 'bg-indigo-100 text-indigo-800' 
                : user?.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-green-100 text-green-800'
            }`}>
              {user?.role === 'psychologist' 
                ? 'Profesional de salud' 
                : user?.role === 'admin' 
                  ? 'Administrador del sistema' 
                  : 'Paciente'}
            </div>
                
              </div>
            </div>

          </div>
          
          {/* Navegación */}
          <nav className="space-y-2 font-medium">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id || 
                               (item.href && pathname?.includes(item.href));
              
              return (
                <Link 
                  href={item.href} 
                  key={item.id} 
                  onClick={() => handleLinkClick(item.id)}
                  className={`w-full h-14 flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-300' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          {/* Botón de logout separado - siempre al final */}
          <button 
            onClick={handleLogout}
            className="w-full mt-4 flex px-4 py-3 text-left rounded-lg transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="flex-1">Cerrar sesión</span>
          </button>
        </div>
      </aside>
      
      {/* Overlay para cerrar el sidebar en móvil al hacer clic fuera */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/25 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  )
}

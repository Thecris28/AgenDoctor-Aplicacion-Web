'use client'
import { Home, User, Calendar, Users, Settings, FileText, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState('inicio');
  const router = useRouter();

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home, href: '/dashboard/inicio' },
    { id: 'citas', label: 'Citas', icon: Calendar, href: '/dashboard/citas' },
    { id: 'pacientes', label: 'Pacientes', icon: Users, href: '/dashboard/pacientes' },
    { id: 'reportes', label: 'Reportes', icon: FileText, href: '/dashboard/reportes' },
    { id: 'perfil', label: 'Perfil', icon: User, href: '/dashboard/perfil' },
    { id: 'configuracion', label: 'Configuración', icon: Settings, href: '/dashboard/configuracion' },
  ];

  const handleLogout = () => {
    // Limpiar datos del usuario
    localStorage.removeItem('token');
    // Si usas store de Zustand
    // clearProfesional();
    
    // Redirigir a la página principal
    router.push('/');
  };

  console.log(activeSection)
  
  return (
    <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-6 py-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200">
        <nav className="space-y-2 font-medium">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                href={item.href} 
                key={item.id} 
                onClick={() => setActiveSection(item.id)}
                className={`w-full h-14 flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                  activeSection === item.id 
                    ? 'bg-blue-50 text-blue-600 border border-blue-300' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="flex-1">{item.label}</span>
              </Link>
            )
          })}
          
          {/* Botón de logout separado */}
          <button 
            onClick={handleLogout}
            className="w-full h-14 flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="flex-1">Cerrar sesión</span>
          </button>
        </nav>
      </div>
    </aside>
  )
}

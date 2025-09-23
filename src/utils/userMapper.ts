// Interfaz para los datos que vienen del backend
interface BackendUserResponse {
  IdUsuario: number
  CorreoElectronico: string
  Contrasena: string
  Token: string | null
  PersonaIdPersona: number
  TipoUsuarioId: number
  PsicologoIdPsicologo: number | null
}

// Función para mapear datos del backend a tu interfaz User
export const mapBackendUserToUser = (backendUser: BackendUserResponse, additionalData?: any): User => {
  // Determinar el rol basado en TipoUsuarioId
  const getRoleFromTipoUsuario = (tipoUsuarioId: number): 'psychologist' | 'patient' | 'admin' => {
    switch (tipoUsuarioId) {
      case 1:
        return 'admin'
      case 2:
        return 'psychologist'
      case 3:
        return 'patient'
      default:
        return 'patient'
    }
  }

  return {
    id: backendUser.IdUsuario,
    email: backendUser.CorreoElectronico,
    name: additionalData?.name || backendUser.CorreoElectronico.split('@')[0], // Fallback al nombre del email
    role: getRoleFromTipoUsuario(backendUser.TipoUsuarioId)
  }
}

// Interfaz para tu User
interface User {
  id: number
  email: string
  name: string
  role: 'psychologist' | 'patient' | 'admin'
}

import { useAuthStore } from '@/store/auth.store'
import { getLogin } from '@/services/authService'


const getRoleFromTipoUsuario = (tipoUsuarioId: number): 'psychologist' | 'patient' | 'admin' => {
    switch (tipoUsuarioId) {
      case 1:
        return 'patient'
      case 2:
        return 'psychologist'
      case 3:
        return 'admin'
      default:
        return 'patient'
    }
  }

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout } = useAuthStore()

  const loginUser = async ( email: string, password: string ) => {
      const response = await getLogin(email, password )
        
        if( response.Success ) {
          console.log('Respuesta completa:', response); // Ver estructura completa
          console.log('Data recibida:', response.data);
            const userdata = response.data[0];
            setUser({
            idUsuario: userdata.IdUsuario,
            email: userdata.CorreoElectronico,
            token: userdata.Token || '',
            idPersona: userdata.PersonaIdPersona,
            idTipoUsuario: userdata.TipoUsuarioId,
            idPsicologo: userdata.PsicologoIdPsicologo,
            role: getRoleFromTipoUsuario(userdata.TipoUsuarioId),
        })
         console.log('User actualizado:', useAuthStore.getState().user)
        return userdata
        }
      
        }

        const logoutUser = () => {
          logout()
        }

        return {
          user,
          isAuthenticated,
          loginUser,
          logoutUser
        }
      }
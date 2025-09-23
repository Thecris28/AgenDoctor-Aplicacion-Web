import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface User {
  idUsuario: number
  email: string
  token: string
  idPersona: number
  idTipoUsuario: number
  idPsicologo: number | null
  role: 'psychologist' | 'patient' | 'admin'
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  
  // Actions
  
  setUser: (user: User) => void
  clearUser: () => void
  updateUser: (userData: Partial<User>) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user: User) => set({ 
        user, 
        isAuthenticated: true
      }),

      clearUser: () => set({ 
        user: null, 
        isAuthenticated: false
      }),

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      logout: () => {
        // Limpiar localStorage
        localStorage.removeItem('user-session');
        // Limpiar store
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'user-session', // Nombre para localStorage
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)


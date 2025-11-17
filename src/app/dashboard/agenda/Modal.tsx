'use client'
import { Check } from 'lucide-react'

type modalProps = {
  isOpen: boolean,
  onClose: () => void,
  text?: string
}

export default function Modal({ isOpen, onClose, text }: modalProps) {
    if (!isOpen) return null

  return (
    <>
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                 <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
                   <Check className="h-12 w-12 mx-auto mb-4 text-green-500" />
                   <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Éxito!</h2>
                   <p className="text-gray-600 mb-6">{text || 'La acción se ha completado correctamente.'}</p>
                   <button
                     onClick={onClose}
                     className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                   >Cerrar</button>
                 </div>
               </div>
    </>
  )
}

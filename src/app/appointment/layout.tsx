import Sidebar from '@/components/Sidebar'
import React from 'react'

export default function AppointmentLayout({children}: {children: React.ReactNode}) {
  return (
    <div className='bg-gray-50 h-screen'>
      
        <Sidebar />
      <div className='md:ml-64 bg-gray-50' >
        <div className='rounded-lg bg-gray-50'>
            {children}
        </div>
      </div>
    </div>
  )
}

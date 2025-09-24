import Sidebar from '@/components/Sidebar'
import React from 'react'

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <div className='bg-gray-50 h-screen'>
      
        <Sidebar />
      <div className='p-4 md:ml-64'>
        <div className='p-4   rounded-lg d'>
            {children}
        </div>
      </div>
    </div>
  )
}

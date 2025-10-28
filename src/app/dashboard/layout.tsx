
import Sidebar from '@/components/Sidebar'
import { ReactNode } from 'react'

export default function Dashboard({children}: {children: ReactNode}) {


  return (
    <div className='bg-gray-50'>
      <Sidebar />
      <div className="md:ml-64 md:mt-0">
      <div className="rounded-lg">
        {children}
        
      </div>
    </div>
    </div>
  )
}


import Sidebar from '@/components/Sidebar'
import { ReactNode } from 'react'

export default function Dashboard({children}: {children: ReactNode}) {


  return (
    <div>
      <Sidebar />
      <div className="p-4 md:ml-64 mt-12 md:mt-0">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        {children}
        
      </div>
    </div>
    </div>
  )
}

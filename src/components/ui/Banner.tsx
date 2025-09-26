
import Image from "next/image";


export default function Banner() {
  return (
    <header className="bg-white border-b border-gray-200 px-10 py-4 w-full">
      <div className="flex items-center justify-between w-full max-w-8xl mx-auto">
       
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Image src="/logo5.svg" alt="Logo" width={58} height={58} />
            </div>
            <div className="text-center">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-blue-600">Agen</span>
                <span className="text-2xl font-bold text-gray-900">Doctor</span>
              </div>
              <div className="text-xs text-gray-500 tracking-widest uppercase">
                Psicologia Online
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

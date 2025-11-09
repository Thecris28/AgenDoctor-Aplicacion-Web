import { linksLanding } from "@/data/mockData";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";



export default function NavbarWeb() {
    const router = useRouter();
    return (
        <nav className='hidden md:flex items-center justify-between p-4 max-w-7xl mx-auto'>
            <div className='flex items-center gap-2'>
                <Image src={"/logo5.svg"} alt="Logo 5" width={50} height={50} />
                <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">Agen</span>
                    <span className="text-3xl font-bold text-blue-500">Doctor</span>
                </div>
            </div>
            <div className="flex gap-1.5">
                {
                    linksLanding.map((link) => (
                        <Link href={link.href} key={link.name}
                            className="text-base font-medium text-gray-800
                hover:text-blue-500 transition-colors duration-300 ease-in-out
                 px-2 rounded-md"
                        >{link.name}</Link>
                    ))
                }
            </div>
            <div className="flex gap-4">
                <button
                onClick={() => router.push('/login')}
                className="rounded-md bg-transparent text-base text-blue-500 outline-1 outline-blue-500 px-4 py-1 cursor-pointer hover:bg-blue-100">Iniciar Sesión</button>
                <button
                onClick={() => router.push('/register/roleSelection')}
                className="rounded-md bg-blue-500 text-base text-white px-4 py-1 hover:bg-blue-400 cursor-pointer">Registrarse</button>
            </div>
        </nav>
    )
}

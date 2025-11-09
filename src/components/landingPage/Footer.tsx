import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">AgenDoctor</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Conectamos a las personas con profesionales de la salud mental de manera fácil, segura y accesible.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">Sobre Nosotros</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white">Servicios</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white">Política de Privacidad</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Términos de Uso</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-white">Política de Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {year} AgenDoctor. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
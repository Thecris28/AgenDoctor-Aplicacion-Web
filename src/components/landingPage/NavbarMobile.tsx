'use client';
import { linksLanding } from '@/data/mockData';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

export default function NavbarMobile() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }
    return (
        <nav className="md:hidden flex items-center justify-between px-4 py-2 bg-white ">
            <div className='flex items-center gap-2.5'>
                <div className="relative">
                    <Image src="/logo5.svg" alt="Logo" width={50} height={50} />
                </div>
                <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-blue-600">Agen</span>
                    <span className="text-2xl font-bold text-gray-900">Doctor</span>
                </div>
            </div>
            <div className="relative z-30">
                <label className="relative w-6 h-5 cursor-pointer block bg-transparent" htmlFor="burger">
                    <input
                        type="checkbox"
                        id="burger"
                        className="hidden"
                        checked={isOpen}
                        onChange={toggleMenu}
                    />
                    <span className={`block absolute h-1 w-full bg-black rounded-lg left-0 top-0 transform transition-all duration-250 ease-in-out origin-[left]
                    ${isOpen ? 'rotate-44 top-0 left-[5px]' : ''}`}></span>
                    <span className={`block absolute h-1 w-full bg-black rounded-lg left-0 top-1/2 -translate-y-1/2 transform transition-all duration-250 ease-in-out
                    ${isOpen ? 'w-0 opacity-0' : ''}`}></span>
                    <span className={`block absolute h-1 w-full bg-black rounded-lg left-0 top-full -translate-y-full transform transition-all duration-250 ease-in-out origin-[left]
                    ${isOpen ? '-rotate-43 top-[28px] left-[5px]' : ''}`}></span>
                </label>
            </div>

            {/* <button className="w-10 h-10 p-2 flex items-center justify-center bg-backgroundCard rounded cursor-pointer
        relative z-10"
                onClick={() => setIsOpen(!isOpen)}>
                <Image src="/icon-hamburger.svg" alt="Hamburger icon" width={28} height={28}>
                </Image>
            </button> */}
            <div className={`fixed z-20 inset-0 flex flex-col bg-backgroundCard gap-3 items-center justify-center
        transition-(clip-path) duration-500 ${isOpen === false ? 'clip-circle-0' : 'clip-circle-full'} 
        md:bg-transparent md:clip-circle-none md:gap-6`} >
                {
                    linksLanding.map((link) => (

                        <Link href={link.href} key={link.name}
                            className="text-2xl font-normal text-black"
                            onClick={() => setIsOpen(false)}
                        >{link.name}</Link>

                    ))
                }

            </div>

        </nav>
    )
}

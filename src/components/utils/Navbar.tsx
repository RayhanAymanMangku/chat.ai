"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { FaBars } from "react-icons/fa6";
import SideMenu from '../custom/SideMenu';
import Link from 'next/link';


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpenMenu = () => {
        setIsOpen(!isOpen);
    }
    return (
        <nav className="flex w-full md:w-[60%] mx-auto py-4 px-4 lg:px-0">
            <div className="container mx-auto flex items-center justify-between">
                <div className="w-24"></div>
                <Link href="/chat">
                    <Image src="/assets/chatai.png" width={100} height={100} alt="logo" />
                </Link>
                <div className="flex justify-end w-24">
                    <FaBars className="text-2xl text-white cursor-pointer" onClick={handleOpenMenu} />
                </div>
                <SideMenu isOpen={isOpen} onOpenChange={() => setIsOpen(!isOpen)} />

            </div>
        </nav>
    )
}

export default Navbar
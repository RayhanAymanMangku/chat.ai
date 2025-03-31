"use client"
import { useState } from 'react'
import Image from 'next/image'
import { FaBars } from "react-icons/fa6"
import Link from 'next/link'
import SideMenu from '../custom/SideMenu'

interface NavbarProps {
    setActiveSessionId: (id: string | null) => void
    refreshSessions: () => void
    activeSessionId: string | null
}

const Navbar = ({ setActiveSessionId, refreshSessions, activeSessionId }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="flex w-full md:w-[60%] mx-auto py-4 px-4 lg:px-0">
            <div className="container mx-auto flex items-center justify-between">
                <div className="w-24"></div>
                <Link href="/chat">
                    <Image src="/assets/chatai.png" width={100} height={100} alt="logo" />
                </Link>
                <div className="flex justify-end w-24">
                    <FaBars
                        className="text-2xl text-white cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    />
                </div>
                <SideMenu
                    isOpen={isOpen}
                    onOpenChange={setIsOpen}
                    setActiveSessionId={setActiveSessionId}
                    refreshSessions={refreshSessions}
                    activeSessionId={activeSessionId} // Pass activeSessionId here
                />
            </div>
        </nav>
    )
}

export default Navbar
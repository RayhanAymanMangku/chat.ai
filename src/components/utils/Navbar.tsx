import React from 'react'
import Image from 'next/image'


const Navbar = () => {
    return (
        <nav className="w-full py-4">
            <div className="flex items-center justify-center">
                <Image src="/assets/chatai.png" width={100} height={100} alt="logo" />
            </div>
        </nav>
    )
}

export default Navbar
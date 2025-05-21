import React from 'react'
import Image from 'next/image'

function Header() {
  return (
    <div className="fixed z-50 w-full h-16 flex justify-center items-center border-b border-gray-300 dark:border-gray-700 shadow-sm bg-white dark:bg-[#121212]">
        <header className="w-full h-16 flex  items-center space-x-4">
        <Image 
        src="/image/agricultura.png"
        alt='logo'
        width={80}
        height={50}        
        />
        <h1  className="text-2xl font-semibold text-500 tracking-wide">TerraNova</h1>
      </header>
    </div>  
  )
}

export default Header
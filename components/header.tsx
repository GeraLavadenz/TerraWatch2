import React from 'react'
import Image from 'next/image'

function Header() {
  return (
    <div className="relative z-50 w-full h-16 border-b border-gray-300 dark:border-gray-700 shadow-sm bg-white dark:bg-[#121212] overflow-hidden">
      
      {/* Fondo de imagen con opacidad */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
        style={{ backgroundImage: `url('/image/fondo-header.png')` }} // cambia el path por el correcto
      />

      {/* Contenido del header */}
      <header className="relative w-full h-16 flex items-center px-4 space-x-4 z-10">
        <Image 
          src="/image/agricultura.png"
          alt="logo"
          width={80}
          height={50}        
        />
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 tracking-wide">TerraWatch</h1>
      </header>
    </div>  
  )
}

export default Header

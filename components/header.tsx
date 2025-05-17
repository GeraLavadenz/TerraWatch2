import React from 'react'
import Image from 'next/image'

function Header() {
  return (
    <div className="bg-[#121827] w-full h-16 flex justify-center items-center border-b border-[#1f2937] ">
        <header className="bg-[#121827] w-full h-16 flex  items-center border-b border-[#1f2937] space-x-4">
        <Image 
        src="/image/agricultura.png"
        alt='logo'
        width={80}
        height={50}        
        />
        <h1 style={{ color: '#93ee87' }} className="text-2xl font-semibold text-500 tracking-wide">Terrawatch</h1>
      </header>
    </div>  
  )
}

export default Header
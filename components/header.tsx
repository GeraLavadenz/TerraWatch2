"use client"

import React from "react"
import Image from "next/image"
import { BotonNotificaciones } from "@/components/BotonNotificaciones"
import { AlertPanelFijo } from "@/components/alertSection"

function Header() {
  return (
    <>
      <div className="fixed z-50 w-full h-16 flex justify-between items-center px-4 border-b border-gray-300 dark:border-gray-700 shadow-sm bg-white dark:bg-[#121212]">
        <header className="flex items-center space-x-4">
          <Image 
            src="/image/agricultura.png"
            alt="logo"
            width={80}
            height={50}
          />
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 tracking-wide">
            TerraWatch
          </h1>
        </header>

        <div className="flex items-center gap-3">
          <BotonNotificaciones />
        </div>
      </div>

      <AlertPanelFijo />
    </>
  )
}

export default Header



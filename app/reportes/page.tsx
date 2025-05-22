import React from 'react'
import Link from 'next/link';
import Menu from '@/components/Menu';
import Header from '@/components/header';
import { AlertSection } from '@/components/alertSection';

function Reportes() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <div className="h-16">
       <Header />
      </div>
        
        <div className="flex flex-1 overflow-hidden">
        <div className="w-52 border-r overflow-y-auto">
          <Menu />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-5 relative inline-block">
            📊 Reportes
            <span className="absolute left-0 bottom-0 w-full h-1 bg-indigo-500 animate-pulse"></span>
          </h1>

        </div>

        <div className="w-60  border-l overflow-y-auto p-4 hidden xl:block">
          <AlertSection />
        </div>
      </div>
    </div>
  )
}

export default Reportes
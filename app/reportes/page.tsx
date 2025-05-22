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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
          </div>
        </div>

        <div className="w-60  border-l overflow-y-auto p-4 hidden xl:block">
          <AlertSection />
        </div>
      </div>
    </div>
  )
}

export default Reportes
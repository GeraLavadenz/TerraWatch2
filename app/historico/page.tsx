import React from 'react'
import Menu from '@/components/Menu';
import Header from '@/components/header';
import { AlertSection } from '@/components/alertSection';
import {ComponentChartsInteractive} from '@/components/charts/historico/Bar Chart - Interactive';


function Historico() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16">
        <Header />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* Menú lateral */}
        <div className="w-26 xl:w-52 border-r overflow-y-auto">
          <Menu />
        </div>

        {/* Contenido central */}
        <div className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-5 relative inline-block">
              📈 Histórico
              <span className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 animate-pulse"></span>
            </h1>
          </div>

          {/* Gráfico */}
          <div className="flex-1 overflow-auto mt-4">
            <ComponentChartsInteractive />
          </div>
        </div>
        <div className="w-40 xl:w-60 border-l overflow-y-auto p-4 hidden xl:block">
          <AlertSection />
        </div>
      </div>
    </div>
  );
}

export default Historico
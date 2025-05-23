import React from 'react'
import Menu from '@/components/Menu';
import Header from '@/components/header';
import { AlertSection } from '@/components/alertSection';
import { ComponentPieChart } from '@/components/charts/Pie Chart - Donut with Text D';
import { HumedadChart } from '@/components/charts/Radial Chart - Stacked D';
import {TemperaturaLineChart} from '@/components/charts/Line Chart D';

function Dashboard() {
  return (
     <div className="flex flex-col min-h-screen ">
      <div className="h-16">
       <Header />
      </div>

        <div className="flex flex-1 overflow-hidden">
        <div className="w-26 xl:w-52 border-r overflow-y-auto">
          <Menu />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentPieChart />
            <HumedadChart />
            <TemperaturaLineChart/>
          </div>
        </div>

        <div className="w-40 xl:w-60  border-l overflow-y-auto p-6 ">
          <AlertSection />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
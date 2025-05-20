import React from 'react'
import Menu from '@/components/Menu';
import Header from '@/components/header';
import { AlertSection } from '@/components/alertSection';
import { ComponentPieChart } from '@/components/Pie Chart - Donut with Text';
import { TemperaturaChart } from '@/components/Radial Chart - Stacked';

function Dashboard() {
  return (
    <div>
      < Header/>
      <Menu/>   
      <AlertSection/>
      <div className='h-full'>
        <ComponentPieChart/>
        <TemperaturaChart/>
      </div> 
    </div>
  )
}

export default Dashboard
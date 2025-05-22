import React from 'react'
import Menu from '@/components/Menu';
import Header from '@/components/header';
import { AlertSection } from '@/components/alertSection';
import { ComponentPieChart } from '@/components/charts/Pie Chart - Donut with Text';
import { TemperaturaChart } from '@/components/charts/Radial Chart - Stacked';

function Dashboard() {
  return (
    <div className='relative flex'>     
      < Header/>
      <Menu/>   
      <AlertSection/>
      <div className='top-30 mx-auto relative h-screen'>
        <div className='mx-auto flex flex-row items-center justify-center'>
          <ComponentPieChart />
          <TemperaturaChart/>
        </div> 
      </div> 
    </div>
  )
}

export default Dashboard
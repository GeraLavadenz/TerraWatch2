import React from 'react'
import Menu from '@/components/Menu';
import Header from '@/components/header';
import { AlertSection } from '@/components/alertSection';
import { ComponentPieChart } from '@/components/Pie Chart - Donut with Text';

function Dashboard() {
  return (
    <div>
      < Header/>
      <Menu/>   
      <AlertSection/>
      <div className='h-full'>
        <ComponentPieChart/>
      </div> 
    </div>
  )
}

export default Dashboard
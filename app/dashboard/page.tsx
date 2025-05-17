import React from 'react'
import Menu from '@/components/Menu';
import Header from '@/components/header';
import { AlertSection } from '@/components/alertSection';

function Dashboard() {
  return (
    <div>
      < Header/>
      <Menu/>   
      <AlertSection/>       
    </div>
  )
}

export default Dashboard
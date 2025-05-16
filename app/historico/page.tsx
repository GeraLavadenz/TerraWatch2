import React from 'react'
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"    

function Historico() {
  return (
    <div> 
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1"><Link href="/dashboard">Dashboard </Link></AccordionItem>
        <AccordionItem value="item-2"><Link href="/historico">Historico</Link> </AccordionItem>
        <AccordionItem value="item-3"><Link  href="/reportes">Reportes</Link></AccordionItem>  
      </Accordion>
    </div>
  )
}

export default Historico() 
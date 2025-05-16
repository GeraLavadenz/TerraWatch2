import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link';

import React from 'react'

function Menu() {
  return (
    <div className="fixed top-0 left-0 w-52 bg-gray-900 text-white p-4 h-full shadow-md"> 
        <h2 className="text-xl font-semibold mb-4">Menú</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:bg-gray-700 p-2 rounded">
              <Link href="../app" className="block w-full">📊 Dashboard</Link>
            </AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:bg-gray-700 p-2 rounded">
              <Link href="../app/historico" className="block w-full">📁 Histórico</Link>
            </AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="hover:bg-gray-700 p-2 rounded">
              <Link href="../app/reportes" className="block w-full">📄 Reportes</Link>
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </div>
  )
}

export default Menu
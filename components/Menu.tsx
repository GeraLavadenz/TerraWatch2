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
    <div className="fixed left-0 w-52 p-4 h-full bg-white dark:bg-[#1a1a1a] border-r border-gray-300 dark:border-gray-700 shadow-md"> 
        <h2 className="text-xl font-semibold mb-4">Menú</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:bg-gray-700 p-2 rounded">
              <Link href="/dashboard" className="block w-full">📊 Dashboard</Link>
            </AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:bg-gray-700 p-2 rounded">
              <Link href="/historico" className="block w-full">📁 Histórico</Link>
            </AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="hover:bg-gray-700 p-2 rounded">
              <Link href="/reportes" className="block w-full">📄 Reportes</Link>
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </div>
  )
}

export default Menu
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from 'next/link';
import React from 'react';

function Menu() {
  return (
    <div className="fixed top-16 left-0 w-26 xl:w-52 p-4 h-full bg-white dark:bg-[#1a1a1a] border-r border-gray-300 dark:border-gray-700 shadow-md transition-all duration-300">
     
      <h2 className="hidden xl:block text-xl font-semibold mb-4">Menú</h2>

      <Accordion type="single" collapsible className="space-y-2">
        {/* Dashboard */}
        <AccordionItem value="item-1">
          <AccordionTrigger className="hover:bg-gray-700 p-2 rounded flex items-center justify-center xl:justify-start space-x-2">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-lg">📊</span>
              <span className="hidden xl:inline-block">Dashboard</span>
            </Link>
          </AccordionTrigger>
        </AccordionItem>

        {/* Histórico */}
        <AccordionItem value="item-2">
          <AccordionTrigger className="hover:bg-gray-700 p-2 rounded flex items-center justify-center xl:justify-start space-x-2">
            <Link href="/historico" className="flex items-center space-x-2">
              <span className="text-lg">📁</span>
              <span className="hidden xl:inline-block">Histórico</span>
            </Link>
          </AccordionTrigger>
        </AccordionItem>

        {/* Reportes */}
        <AccordionItem value="item-3">
          <AccordionTrigger className="hover:bg-gray-700 p-2 rounded flex items-center justify-center xl:justify-start space-x-2">
            <Link href="/reportes" className="flex items-center space-x-2">
              <span className="text-lg">📄</span>
              <span className="hidden xl:inline-block">Reportes</span>
            </Link>
          </AccordionTrigger>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default Menu;

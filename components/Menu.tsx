"use client";

import React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface MenuProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function Menu({ isOpen, setIsOpen }: MenuProps) {
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botón hamburguesa solo en móviles */}
      <button
        onClick={toggleMenu}
        className="fixed top-20 left-4 z-50 p-2 bg-gray-200 dark:bg-gray-800 rounded-md xl:hidden"
      >
        {isOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Menú lateral */}
      <div
        className={`
          fixed xl:fixed top-16 left-0 z-40
          w-52 h-[calc(100vh-4rem)] 
          bg-white dark:bg-[#1a1a1a] border-r border-gray-300 dark:border-gray-700
          shadow-md transition-transform duration-300 xl:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0
        `}
      >
        <div className="p-4 overflow-y-auto h-full">
          <h2 className="text-xl font-semibold mb-4 hidden xl:block">Menú</h2>

          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:bg-gray-700 p-2 rounded flex items-center justify-start space-x-2">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">📊</span>
                  <span className="hidden xl:inline-block">Dashboard</span>
                </Link>
              </AccordionTrigger>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="hover:bg-gray-700 p-2 rounded flex items-center justify-start space-x-2">
                <Link
                  href="/historico"
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">📁</span>
                  <span className="hidden xl:inline-block">Histórico</span>
                </Link>
              </AccordionTrigger>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="hover:bg-gray-700 p-2 rounded flex items-center justify-start space-x-2">
                <Link
                  href="/reportes"
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">📄</span>
                  <span className="hidden xl:inline-block">Reportes</span>
                </Link>
              </AccordionTrigger>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
}

export default Menu;

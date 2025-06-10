"use client";

import React, { useState } from "react";
import Menu from "@/components/Menu";
import Header from "@/components/header";
import { AlertSection } from "@/components/alertSection";
import { ComponentPieChart } from "@/components/charts/dashboard/Pie Chart - Donut with Text D";
import { HumedadChart } from "@/components/charts/dashboard/Radial Chart - Stacked D";
import { ComponentLecturasActualesTemp } from "@/components/charts/dashboard/Bar Chart - Negative";



function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header superior */}
      <header className="h-16 w-full shadow-sm bg-popover text-popover-foreground border-b border-border">
        <Header />
      </header>

      {/* Contenedor principal: menú lateral, contenido central y alertas */}
      <main className="flex flex-1 flex-col md:flex-row overflow-hidden bg-background">
        
        {/* Menú lateral con soporte móvil y escritorio */}
        <div className="md:relative md:block w-0 md:w-20 xl:w-52">
          <Menu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
        </div>

        {/* Contenido principal */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-6 bg-card text-card-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <ComponentPieChart />
            <HumedadChart />
            <ComponentLecturasActualesTemp />
          </div>
        </section>

        {/* Alertas (lado derecho) */}
        <aside className="hidden lg:block w-40 xl:w-60 bg-sidebar text-sidebar-foreground border-l border-sidebar-border overflow-y-auto p-4 sm:p-6">
          <AlertSection />
        </aside>
      </main>
    </div>
  );
}

export default Dashboard;

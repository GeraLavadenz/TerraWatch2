import React from 'react'
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function Dashboard() {
  return (
    <div>
      {/*<NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>Dasboard</NavigationMenuItem>
          <NavigationMenuItem>Historico</NavigationMenuItem>
          <NavigationMenuItem>Reportes</NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>*/}

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1"><Link href="/dahboard">Dashboard </Link></AccordionItem>
        <AccordionItem value="item-2"><Link href="/historico">Historico</Link> </AccordionItem>
        <AccordionItem value="item-3"><Link  href="/reportes">Reportes</Link></AccordionItem>  
      </Accordion>
    </div>
  )
}

export default Dashboard
"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AlertSection } from "@/components/alertSection"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"

export function BotonNotificaciones() {
  const [open, setOpen] = useState(false)
  const [hayAlerta, setHayAlerta] = useState(false)

  useEffect(() => {
    const db = database
    const check = (val: string | null) => val !== "Sin datos" && val !== "Error"

    const unsubLluvia = onValue(ref(db, "alertas/lluvia"), (snap) => {
      if (check(snap.val())) setHayAlerta(true)
    })
    const unsubLluviaProlongada = onValue(ref(db, "alertas/lluvia_prolongada"), (snap) => {
      if (check(snap.val())) setHayAlerta(true)
    })
    const unsubHumedad = onValue(ref(db, "alertas/humedad"), (snap) => {
      if (check(snap.val())) setHayAlerta(true)
    })

    return () => {
      unsubLluvia()
      unsubLluviaProlongada()
      unsubHumedad()
    }
  }, [])

  return (
    <div className="block md:hidden">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="relative p-2 rounded-full hover:bg-muted transition"
            aria-label="Ver notificaciones"
          >
            <Bell className="w-6 h-6 text-gray-800 dark:text-white" />
            {hayAlerta && (
              <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[90vw] max-w-sm p-0 bg-white dark:bg-[#1a1a1a] border rounded shadow z-50"
          align="end"
          side="bottom"
        >
          <div className="p-4 max-h-[80vh] overflow-y-auto">
            <AlertSection />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}


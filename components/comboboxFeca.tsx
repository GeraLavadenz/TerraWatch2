import { useState, useEffect } from "react"
import { ComboboxBase } from "./ui/combobox"
import { getDatabase, ref, onValue } from "firebase/database"

export default function ComboboxFecha({
  tipo,
  onChange,
}: {
  tipo: "día" | "mes"
  onChange: (fecha: string) => void
}) {
  const [opciones, setOpciones] = useState<{ value: string; label: string }[]>([])
  const [valor, setValor] = useState("")

  useEffect(() => {
    const db = getDatabase()
    const refLecturas = ref(db, "lecturas")
    onValue(refLecturas, (snapshot) => {
      const data = snapshot.val()
      if (!data) return

      const fechas = Object.keys(data)
      const valores = tipo === "mes"
        ? [...new Set(fechas.map(f => f.slice(0, 7)))]
        : fechas

      setOpciones(valores.map(f => ({ value: f, label: f })))
    })
  }, [tipo])

  return (
    <ComboboxBase
      opciones={opciones}
      value={valor}
      setValue={(v) => {
        setValor(v)
        onChange(v)
      }}
      placeholder={`Seleccionar ${tipo}`}
    />
  )
}

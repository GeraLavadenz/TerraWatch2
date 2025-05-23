import { useState } from "react"
import { ComboboxBase } from "./ui/combobox"

const opciones = [
  { value: "día", label: "Por día" },
  { value: "mes", label: "Por mes" },
]

export default function ComboboxTipo({ onChange }: { onChange: (v: string) => void }) {
  const [valor, setValor] = useState("")

  return (
    <ComboboxBase
      opciones={opciones}
      value={valor}
      setValue={(v) => {
        setValor(v)
        onChange(v)
      }}
      placeholder="Seleccionar periodo..."
    />
  )
}

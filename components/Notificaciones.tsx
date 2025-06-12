"use client";

import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

// ✅ Definir tipo para notificación
interface Notificacion {
  mensaje: string;
  tipo: "Peligro" | "Alerta" | "Advertencia" | "Información";
  nivel: "Bajo" | "Medio" | "Alto";
  sensores: string[];
  hora: string;
}

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    const db = getDatabase();
    const fecha = new Date().toISOString().split("T")[0];
    const refNotif = ref(db, `/notificaciones/${fecha}`);

    const unsubscribe = onValue(refNotif, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setNotificaciones([]);
        return;
      }

      const lista: Notificacion[] = Object.entries(data).map(([hora, valor]) => ({
        ...(valor as Omit<Notificacion, "hora">),
        hora,
      }));

      setNotificaciones(lista.reverse());
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">🔔 Notificaciones</h2>
      <ul className="space-y-2">
        {notificaciones.length === 0 ? (
          <li className="text-gray-500 text-sm">No hay notificaciones registradas hoy.</li>
        ) : (
          notificaciones.map((n, i) => (
            <li
              key={i}
              className={`p-3 rounded ${
                n.tipo === "Peligro"
                  ? "bg-red-100"
                  : n.tipo === "Alerta"
                  ? "bg-yellow-100"
                  : n.tipo === "Advertencia"
                  ? "bg-orange-100"
                  : "bg-green-100"
              }`}
            >
              <strong>{n.tipo}:</strong> {n.mensaje}
              <div className="text-sm text-gray-600">🕒 {n.hora}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

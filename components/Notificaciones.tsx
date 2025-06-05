"use client";

import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState<any[]>([]);

  useEffect(() => {
    const db = getDatabase();
    const fecha = new Date().toISOString().split("T")[0];
    const refNotif = ref(db, `/notificaciones/${fecha}`);

    onValue(refNotif, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      const lista = Object.entries(data).map(([hora, n]: any) => ({ hora, ...n }));
      setNotificaciones(lista.reverse());
    });
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">🔔 Notificaciones</h2>
      <ul className="space-y-2">
        {notificaciones.map((n, i) => (
          <li key={i} className={`p-3 rounded ${n.tipo === "Peligro" ? "bg-red-100" : n.tipo === "Alerta" ? "bg-yellow-100" : "bg-green-100"}`}>
            <strong>{n.tipo}:</strong> {n.mensaje}
            <div className="text-sm text-gray-600">🕒 {n.hora}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

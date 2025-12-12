import React, { useState } from "react";

export const Orders = () => {
  const [orders, setOrders] = useState([
    { id: "ORD-001", user: "Juan Pérez", total: "€279.97", status: "Pendiente" },
    { id: "ORD-002", user: "María García", total: "€129.99", status: "Procesando" },
    { id: "ORD-003", user: "Carlos López", total: "€199.98", status: "Enviado" },
  ]);

  const badgeClass = (status) => {
    if (status === "Pendiente") return "badge rounded-pill text-bg-warning-subtle text-warning-emphasis px-3 py-2";
    if (status === "Procesando") return "badge rounded-pill text-bg-primary-subtle text-primary-emphasis px-3 py-2";
    if (status === "Enviado") return "badge rounded-pill text-bg-success-subtle text-success-emphasis px-3 py-2";
    return "badge rounded-pill text-bg-secondary-subtle text-secondary-emphasis px-3 py-2";
  };

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div>
      <h5 className="mb-4">Gestión de Órdenes</h5>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Total</th>
              <th>Estado</th>
              <th className="text-end">Actualizar</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.user}</td>
                <td>{o.total}</td>
                <td>
                  <span className={badgeClass(o.status)}>{o.status}</span>
                </td>
                <td className="text-end">
                  <select
                    className="form-select w-auto ms-auto"
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Procesando">Procesando</option>
                    <option value="Enviado">Enviado</option>
                  </select>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted py-5">
                  No hay órdenes todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
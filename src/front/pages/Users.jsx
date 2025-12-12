import React, { useState } from "react";
import { FaPen } from "react-icons/fa6";

export const Users = () => {
  const [users] = useState([
    { id: 1, name: "Juan Pérez", email: "juan@email.com", orders: 3 },
    { id: 2, name: "María García", email: "maria@email.com", orders: 1 },
    { id: 3, name: "Carlos López", email: "carlos@email.com", orders: 5 },
  ]);

  return (
    <div>
      <h5 className="mb-4">Gestión de Usuarios</h5>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Órdenes</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.orders}</td>
                <td className="text-end">
                  <button className="btn btn-link text-dark" title="Editar">
                    <FaPen />
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted py-5">
                  No hay usuarios todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
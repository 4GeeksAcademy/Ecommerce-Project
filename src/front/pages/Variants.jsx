import React from "react";
import { FaPlus } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";

export const Variants = () => {
  const variants = [
    { id: 1, product: "Vestido Elegante", size: "M", color: "Negro", stock: 15 },
    { id: 2, product: "Vestido Elegante", size: "L", color: "Negro", stock: 8 },
    { id: 3, product: "Camisa Casual", size: "L", color: "Blanco", stock: 23 },
  ];

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Gestión de Variantes</h5>

        <button className="btn btn-dark d-flex align-items-center gap-2">
          <FaPlus /> Crear Variante
        </button>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Talla</th>
              <th>Color</th>
              <th>Stock</th>
              <th className="text-end">Editar</th>
            </tr>
          </thead>

          <tbody>
            {variants.map((v) => (
              <tr key={v.id}>
                <td>{v.product}</td>
                <td>{v.size}</td>
                <td>{v.color}</td>
                <td className={v.stock <= 8 ? "text-danger" : ""}>
                  {v.stock}
                </td>
                <td className="text-end">
                  <button className="btn btn-link text-dark">
                    <FaPen />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
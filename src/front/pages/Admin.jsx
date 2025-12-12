import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { FaBox, FaLayerGroup, FaClipboardList, FaUsers } from "react-icons/fa";
import { FaPlus, FaTrash, FaPen } from "react-icons/fa6";


export const Admin = () => {
  const location = useLocation();

  const products = [
    { id: 1, name: "Vestido Elegante", price: "€129.99", category: "Mujer" },
    { id: 2, name: "Camisa Casual", price: "€49.99", category: "Hombre" },
    { id: 3, name: "Chaqueta Urbana", price: "€139.99", category: "Hombre" },
  ];

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `btn text-start d-flex align-items-center gap-2 ${
      isActive(path) ? "btn-light text-dark" : "btn-dark text-white border-0"
    }`;

  const isProductsPage = location.pathname === "/admin"; 

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* SIDEBAR */}
        <aside className="col-12 col-md-3 col-lg-2 bg-dark text-white p-4">
          <h4 className="mb-4">Admin Panel</h4>

          <div className="d-grid gap-3">
            <Link to="/admin" className={linkClass("/admin")}>
              <FaBox /> Productos
            </Link>

            <Link to="/admin/variants" className={linkClass("/admin/variants")}>
              <FaLayerGroup /> Variantes
            </Link>

            <Link to="/admin/orders" className={linkClass("/admin/orders")}>
              <FaClipboardList /> Órdenes
            </Link>

            <Link to="/admin/users" className={linkClass("/admin/users")}>
              <FaUsers /> Usuarios
            </Link>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="col-12 col-md-9 col-lg-10 bg-light p-4">
       
          {isProductsPage ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Gestión de Productos</h5>

                <button className="btn btn-dark d-flex align-items-center gap-2">
                  <FaPlus /> Crear Producto
                </button>
              </div>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Categoría</th>
                      <th className="text-end">Opciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                        <td>{p.category}</td>
                        <td className="text-end">
                          <button className="btn btn-link text-dark" title="Editar">
                            <FaPen />
                          </button>
                          <button className="btn btn-link text-danger" title="Eliminar">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
           
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};
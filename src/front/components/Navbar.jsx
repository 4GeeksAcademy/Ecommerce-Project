import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa6";
import { IoExitOutline } from "react-icons/io5";
import { useFavorites } from "./FavoritesContext.jsx";
import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getCart } from "../actions";
import trendifyLogo from "../assets/img/Logo.png";

export const Navbar = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const { store, dispatch } = useGlobalReducer();


  useEffect(() => {
    if (store.auth.accessToken && store.cart.items.length === 0) {
      getCart(dispatch, store.auth.accessToken);
    }
  }, [store.auth.accessToken, dispatch]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const handleSearch = async () => {
  if (searchTerm.trim() === "") return;

  try {
    // Usamos el endpoint que me mostraste
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search?q=${searchTerm}`);
    
    if (response.status === 404) {
      alert("No se encontraron productos.");
      return;
    }

    const data = await response.json();

    if (response.ok) {
      // Navegamos a una página de resultados pasando los datos
      navigate("/search-results", { state: { results: data, term: searchTerm } });
      setSearchTerm(""); // Limpiamos el buscador
    }
  } catch (error) {
    console.error("Error buscando productos:", error);
  }
};

  const totalItems = store.cart.count;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">

        <Link className="navbar-brand ms-5" to="/">
          <img 
            src={trendifyLogo}
            alt="Trendify"
            style={{ height: "60px", objectFit: "contain", verticalAlign: "middle"}}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">

          {/* Buscador */}
          <form className="d-flex mx-auto position-relative w-50" role="search">
            <label htmlFor="searchInput" className="visually-hidden">Buscar productos</label>
            <button
              type="button"
              onClick={handleSearch}
              className="position-absolute top-50 start-0 translate-middle-y ms-3 btn btn-link p-0"
              style={{ color: "#6c757d" }}
            >
              <FaSearch />
            </button>
            <input
              id="searchInput"
              className="form-control rounded-pill ps-5 border-dark"
              type="search"
              placeholder="Buscar productos"
              aria-label="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
          </form>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">

            {/* Dropdown Mujer */}
            <li className="nav-item dropdown me-2">
              <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Mujer
              </Link>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/mujer/blusas">Blusas</Link></li>
                <li><Link className="dropdown-item" to="/mujer/faldas">Faldas</Link></li>
                <li><Link className="dropdown-item" to="/mujer/zapatos">Zapatos</Link></li>
              </ul>
            </li>

            {/* Dropdown Hombre */}
            <li className="nav-item dropdown me-3">
              <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Hombre
              </Link>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/hombre/camisas">Camisas</Link></li>
                <li><Link className="dropdown-item" to="/hombre/pantalones">Pantalones</Link></li>
                <li><Link className="dropdown-item" to="/hombre/zapatos">Zapatos</Link></li>
              </ul>
            </li>

            {/* Favoritos */}
            <li className="nav-item me-3">
              <Link to="/favorites" className="nav-link p-0">
                <div
                  className="position-relative d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <FaRegHeart className="text-secondary fs-5" />
                  {favorites.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.6rem", marginTop: "8px", marginLeft: "-4px" }}
                    >
                      {favorites.length}
                    </span>
                  )}
                </div>
              </Link>
            </li>

            {/* Carrito con globito */}
            <li className="nav-item me-3">
              <Link to="/carrito" className="nav-link p-0">
                <div
                  className="position-relative d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <LuShoppingCart className="text-secondary fs-5" />
                  {totalItems > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark"
                      style={{ fontSize: "0.6rem", marginTop: "8px", marginLeft: "-4px" }}
                    >
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>
            </li>
            {/* Link Admin solo visible para usuarios con rol admin */}

            {store.auth?.isLoggedIn && store.auth?.user?.is_admin && (
              <li className="nav-item me-3">
                <Link to="/admin" className="nav-link">
                  Admin
                </Link>
              </li>
            )}

            {/* Login / Logout con icono de salir */}
            <li className="nav-item ms-auto d-flex align-items-center">
              {store.auth.isLoggedIn ? (
                <>
                  <span className="me-2">Hola, {store.auth.user?.name}</span>
                  <IoExitOutline
                    title="Salir"
                    className="text-danger fs-5"
                    style={{ cursor: "pointer" }}
                    onClick={handleLogout}
                  />
                </>
              ) : (
                <Link className="nav-link" to="/login">
                  <FaUser />
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};












// import { useNavigate, Link } from "react-router-dom";
// import { FaSearch, FaUser } from "react-icons/fa";
// import { LuShoppingCart } from "react-icons/lu";
// import { FaRegHeart } from "react-icons/fa6";
// import { IoExitOutline } from "react-icons/io5";
// import { useFavorites } from "./FavoritesContext.jsx";
// import { useState } from "react";
// import useGlobalReducer from "../hooks/useGlobalReducer";


// export const Navbar = ({ cart }) => {
//   const navigate = useNavigate();
//   const { favorites } = useFavorites();
//   const [searchTerm, setSearchTerm] = useState("");
//   const { store, dispatch } = useGlobalReducer();

// const handleLogout = () => {
//   localStorage.removeItem("logged");
//   navigate("/login");
// };
// const handleLogout = () => {
//   dispatch({ type: "LOGOUT" }); // limpia store y localStorage
//   navigate("/login");
// };

//search
//   const handleSearch = () => {

//     const allProducts = [
//       { id: 1, name: "Vestido elegante" },
//       { id: 2, name: "Traje clásico" }
//     ];

//     const found = allProducts.find(p =>
//       p.name.toLowerCase() === searchTerm.toLowerCase()
//     );

//     if (found) {
//       navigate(`/product/${found.id}`);
//     } else {
//       alert("Producto no encontrado");
//     }
//   };

//   const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);


//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       <div className="container-fluid">

//         <Link className="navbar-brand ms-5" to="/">LOGO</Link>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarContent"
//           aria-controls="navbarContent"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon" />
//         </button>

//         <div className="collapse navbar-collapse" id="navbarContent">

//           <form className="d-flex mx-auto position-relative w-50" role="search">
//             <label htmlFor="searchInput" className="visually-hidden">Buscar productos</label>

//             <button type="button" onClick={handleSearch} className="position-absolute top-50 start-0 translate-middle-y ms-3 btn btn-link p-0"
//               style={{ color: "#6c757d" }}><FaSearch />
//             </button>

//             <input id="searchInput" className="form-control rounded-pill ps-5 border-dark" type="search" placeholder="Buscar productos"
//               aria-label="Buscar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(); } }} />
//           </form>


//           <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">

//             <li className="nav-item me-3">
//               <Link
//                 to="/favorites"
//                 className="nav-link p-0"       // sin padding extra
//               >
//                 {/* CÍRCULO CON CORAZÓN */}
//                 <div
//                   className="position-relative d-flex align-items-center justify-content-center rounded-circle border border-secondary"
//                   style={{
//                     width: "40px",
//                     height: "40px",
//                   }}
//                 >

//                   <FaRegHeart className="text-secondary fs-5" />


//                   {
//                     favorites.length > 0 && (
//                       <span
//                         className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger"
//                         style={{ fontSize: "0.6rem" }}
//                       >
//                         {favorites.length}
//                       </span>
//                     )
//                   }
//                 </div >
//               </Link >
//             </li >

//             <li className="nav-item dropdown me-2">
//               <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
//                 Mujer
//               </Link>
//               <ul className="dropdown-menu">
//                 <li><Link className="dropdown-item" to="/mujer/blusas">Blusas</Link></li>
//                 <li><Link className="dropdown-item" to="/mujer/faldas">Faldas</Link></li>
//                 <li><Link className="dropdown-item" to="/mujer/zapatos">Zapatos</Link></li>
//               </ul>
//             </li>


//             <li className="nav-item dropdown me-3">
//               <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
//                 Hombre
//               </Link>
//               <ul className="dropdown-menu">
//                 <li><Link className="dropdown-item" to="/hombre/camisas">Camisas</Link></li>
//                 <li><Link className="dropdown-item" to="/hombre/pantalones">Pantalones</Link></li>
//                 <li><Link className="dropdown-item" to="/hombre/zapatos">Zapatos</Link></li>
//               </ul>
//             </li>

//             <li className="nav-item position-relative me-3">
//               <Link className="nav-link" to="/carrito"> <LuShoppingCart className="icono-carrito" style={{ fontSize: "20px" }} /></Link>

//               {totalItems > 0 && (
//                 <span className="badge bg-dark text-white position-absolute top-0 start-100 translate-middle mt-2" style={{ width: "20px", height: "15px", fontSize: "10px", padding: "0" }}>
//                   {totalItems}
//                 </span>
//               )}
//             </li>

//             <li className="nav-item ms-auto">{store.auth.isLoggedIn ? (
//                 <>
//                   <span className="me-2">Hola, {store.auth.user?.name}</span>
//                   <IoExitOutline
//                     className="text-danger"
//                     style={{ cursor: "pointer" }}
//                     onClick={handleLogout}
//                   />
//                 </>
//               ) : (
//                 <Link className="nav-link" to="/login">
//                   <FaUser />
//                 </Link>
//               )}
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

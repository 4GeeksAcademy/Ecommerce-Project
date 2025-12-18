import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdAddShoppingCart } from "react-icons/md";

export const Card = ({
  id,
  variantId,
  name,  
  price,     
  image,     
  isFavorite,  
  onToggleFavorite,
  onAddToCart,
  disabled, // Esta prop recibe el estado de si está logueado o no
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => setQuantity(q => q > 1 ? q - 1 : 1);
  const handleIncrease = () => setQuantity(q => q + 1);
  return (
    <div className="card border-0" style={{ maxWidth: "320px" }}>
      <Link to={`/product/${id}`} className="text-decoration-none text-dark">
        <div className="position-relative" style={{ height: "220px", overflow: "hidden" }}>
          <img
            src={image}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite(id);
            }}
            className="border-0 p-0"
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
          >
            <i
              className={
                isFavorite
                  ? "fa-solid fa-heart text-danger"
                  : "fa-regular fa-heart text-white"
              }
              style={{ fontSize: "1rem" }}
            />
          </button>
        </div>

        <div className="card-body px-0">
          <h6 className="mb-1">{name}</h6>
          <p className="mb-0 fw-semibold">{price}</p>
        </div>
      </Link>

      {/* Botón de carrito con controles de cantidad */}
      <div className="d-flex align-items-center mt-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Si está deshabilitado, muestra alerta y no ejecuta onAddToCart
            if (disabled) {
              alert("Debes iniciar sesión para agregar productos al carrito.");
              return;
            }
            if (onAddToCart) onAddToCart(quantity); // Pasar quantity
          }}
          className={`btn flex-grow-1 me-1 ${disabled ? "btn-secondary" : "btn-dark"}`}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <MdAddShoppingCart color="white" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDecrease();
          }}
          className="btn btn-outline-secondary btn-sm"
          disabled={disabled}
        >
          −
        </button>
        <span className="mx-2 fw-semibold">{quantity}</span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleIncrease();
          }}
          className="btn btn-outline-secondary btn-sm"
          disabled={disabled}
        >
          +
        </button>
      </div>
    </div>
  );
};









// import React from "react";
// import { Link } from "react-router-dom";
// import { useFavorites } from "./FavoritesContext.jsx";
// import { MdAddShoppingCart } from "react-icons/md";

// export const Card = ({ id, name, price, image, onAddToCart }) => {
//     const { favorites, toggleFavorite } = useFavorites();

//     const isFavorite = favorites.includes(id);

//     return (
//         <div className="card border-0" style={{ maxWidth: "320px" }}>
//             <Link
//                 to={`/product/${id}`}
//                 className="text-decoration-none text-dark"
//             >
//                 <div
//                     className="position-relative"
//                     style={{
//                         height: "220px",
//                         overflow: "hidden",
//                     }}
//                 > 
//                     <img
//                         src={"https://res.cloudinary.com/dds1yrxvu/image/upload/v1765810190/Captura_de_pantalla_2025-12-15_a_la_s_11.40.51_a.m._o5loax.png"}
//                         alt={name}
//                         style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                             display: "block",
//                         }}
//                     />

//                     <button
//                         type="button"
//                         onClick={(e) => {
//                             e.preventDefault();
//                             e.stopPropagation();
//                             toggleFavorite(id);
//                         }}
//                         className="border-0 p-0"
//                         style={{
//                             position: "absolute",
//                             top: "0.5rem",
//                             right: "0.5rem",
//                             width: "32px",
//                             height: "32px",
//                             borderRadius: "50%",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             backgroundColor: "rgba(0, 0, 0, 0.6)",
//                         }}
//                     >
//                         <i
//                             className={
//                                 isFavorite
//                                     ? "fa-solid fa-heart text-danger"
//                                     : "fa-regular fa-heart text-white"
//                             }
//                             style={{ fontSize: "1rem" }}
//                         ></i>
//                     </button>

//                 </div>

//                 <div className="card-body px-0">
//                     <h6 className="mb-1">{name}</h6>
//                     <p className="mb-0 fw-semibold">{price}</p>
//                 </div>
//                 <button type="button" onClick={(e) => {
//                     e.preventDefault(); e.stopPropagation(); if (onAddToCart) onAddToCart({ id, name, price, image });
//                 }} className="btn btn-dark w-25 mt-2"><MdAddShoppingCart className="" color="white" /></button>
//             </Link>


//         </div>
//     );
// };
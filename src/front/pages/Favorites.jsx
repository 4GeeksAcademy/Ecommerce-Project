import React, { useEffect, useState } from "react";
import { useFavorites } from "../components/FavoritesContext.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Card } from "../components/Card.jsx";
import { Link } from "react-router-dom";

export function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const { store } = useGlobalReducer();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${API_URL}/api/products`, {
          headers: {
            "Content-Type": "application/json",
            ...(store.auth.accessToken && {
              Authorization: `Bearer ${store.auth.accessToken}`,
            }),
          },
        });
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Error cargando productos:", err);
      }
    };
    fetchProducts();
  }, [store.auth.accessToken]);

  const favoriteProducts = products.filter((p) =>
    favorites.includes(p.id || p.product_id)
  );

  return (
    <div className="container my-5">
      <h3>Mis Favoritos</h3>

      <Link to="/" className="btn btn-outline-secondary mb-3">
      ← Volver
       </Link>
      {favoriteProducts.length === 0 ? (
        <p>No tienes productos favoritos.</p>
      ) : (
        <div className="row">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="col-12 col-md-4 mb-4">
              <Card
                id={product.id}
                variantId={product.variants?.[0]?.id}
                name={product.name}
                price={`€${product.base_price}`}
                image={product.image_url}
                isFavorite={true}
                onToggleFavorite={() => removeFavorite(product.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}






// import React from "react";
// import { Link } from "react-router-dom";
// import { useFavorites } from "../components/FavoritesContext.jsx";
// import { Card } from "../components/Card.jsx";


// const products = [
//   { id: 1, name: "Vestido elegante", price: "€89.99", image: "/img/vestido.jpg" },
//   { id: 2, name: "Blusa roja", price: "€59.99", image: "/img/blusa.jpg" },
//   { id: 3, name: "Chaqueta negra", price: "€129.99", image: "/img/chaqueta.jpg" },
// ];

// export const Favorites = () => {
//   const { favorites } = useFavorites();

//   const favoriteProducts = products.filter((p) => favorites.includes(p.id));

//   return (
//     <div className="container my-4">
//       <Link to="/" className="btn btn-outline-secondary mb-3">
//         ← Volver
//       </Link>

//       <h2 className="mb-3">Favoritos</h2>

//       {favoriteProducts.length === 0 && (
//         <p>No tienes productos en favoritos todavía.</p>
//       )}

//       <div className="d-flex flex-wrap gap-4">
//         {favoriteProducts.map((p) => (
//           <Card
//             key={p.id}
//             id={p.id}
//             name={p.name}
//             price={p.price}
//             image={p.image}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };
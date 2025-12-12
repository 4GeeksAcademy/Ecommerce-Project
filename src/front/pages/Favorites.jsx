import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../components/FavoritesContext.jsx";
import { Card } from "../components/Card.jsx";


const products = [
  { id: 1, name: "Vestido elegante", price: "€89.99", image: "/img/vestido.jpg" },
  { id: 2, name: "Blusa roja", price: "€59.99", image: "/img/blusa.jpg" },
  { id: 3, name: "Chaqueta negra", price: "€129.99", image: "/img/chaqueta.jpg" },
];

export const Favorites = () => {
  const { favorites } = useFavorites();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="container my-4">
      <Link to="/" className="btn btn-outline-secondary mb-3">
        ← Volver
      </Link>

      <h2 className="mb-3">Favoritos</h2>

      {favoriteProducts.length === 0 && (
        <p>No tienes productos en favoritos todavía.</p>
      )}

      <div className="d-flex flex-wrap gap-4">
        {favoriteProducts.map((p) => (
          <Card
            key={p.id}
            id={p.id}
            name={p.name}
            price={p.price}
            image={p.image}
          />
        ))}
      </div>
    </div>
  );
};
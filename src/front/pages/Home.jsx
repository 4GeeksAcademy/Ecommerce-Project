import React, { useState, useEffect } from "react";
import { Card } from "../components/Card.jsx";
import { Carousel } from "../components/Carousel";
import { useOutletContext } from "react-router-dom";

export const Home = () => {

  const { cart, setCart, searchTerm } = useOutletContext();

  const womenProducts = [
    {
      id: 1,
      name: "Vestido elegante",
      price: "€89.99",
      image: "https://res.cloudinary.com/dds1yrxvu/image/upload/v1765810190/Captura_de_pantalla_2025-12-15_a_la_s_11.40.51_a.m._o5loax.png",
    },
  ];

  const menProducts = [
    {
      id: 2,
      name: "Traje clásico",
      price: "€249.99",
      image: "https://via.placeholder.com/600x400?text=Traje",
    },
  ];

  //filtros del search productos hombre y mujer

  const filteredWomenProducts = womenProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMenProducts = menProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };


  const addToCart = (product) => {

    const priceValue = parseFloat(
      String(product.price).replace(/[^0-9.,]/g, "").replace(",", ".")
    ) || 0;

    const exists = cart.find((p) => p.id === product.id);

    if (exists) {

      //incrementar

      const updated = cart.map((p) =>
        p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
      );
      setCart(updated);
    } else {

      // o agregar

      setCart((prev) => [
        ...prev,
        { ...product, quantity: 1, priceValue },
      ]);
    }
  }

  return (
    <>
      <Carousel />

      <div className="container my-5">
        <section className="mb-5">
          <h2 className="fw-semibold mb-4">Mujer</h2>
          <div className="row g-4">
            {filteredWomenProducts.map((product) => (
              <div key={product.id} className="col-12 col-md-4">
                <Card
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  onAddToCart={() => addToCart(product)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <h2 className="fw-semibold mb-4">Hombre</h2>
          <div className="row g-4">
            {filteredMenProducts.map((product) => (
              <div key={product.id} className="col-12 col-md-4">
                <Card
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  onAddToCart={() => addToCart(product)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
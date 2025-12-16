import React from "react";
import { Link } from "react-router-dom";

export const Faldas = () => {
  const faldas = [
    {
      id: 1,
      name: "Falda Negra",
      price: "€44.99",
      image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0",
    },
    {
      id: 2,
      name: "Falda Jeans",
      price: "€49.99",
      image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475",
    },
    {
      id: 3,
      name: "Falda Plisada",
      price: "€54.99",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
    },
  ];

  return (
    <div className="container my-5">
      <h2 className="mb-4">Faldas</h2>

      <div className="row g-4">
        {faldas.map((item) => (
          <div key={item.id} className="col-12 col-sm-6 col-md-4">
            <div className="card h-100">
              <img src={item.image} className="card-img-top" alt={item.name} />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.price}</p>

                <Link
                  to={`/product/${item.id}`}
                  className="btn btn-dark mt-auto"
                >
                  Ver producto
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
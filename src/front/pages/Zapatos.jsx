import React from "react";
import { Link } from "react-router-dom";

export const Zapatos = () => {
  const zapatos = [
    {
      id: 1,
      name: "Zapatos Negros",
      price: "€79.99",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    },
    {
      id: 2,
      name: "Tacones",
      price: "€89.99",
      image: "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f",
    },
    {
      id: 3,
      name: "Sandalias",
      price: "€59.99",
      image: "https://images.unsplash.com/photo-1582582494700-ec3c9e20c7e3",
    },
  ];

  return (
    <div className="container my-5">
      <h2 className="mb-4">Zapatos</h2>

      <div className="row g-4">
        {zapatos.map((item) => (
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
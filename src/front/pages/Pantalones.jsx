import React from "react";
import { Link } from "react-router-dom";

export const Pantalones = () => {
  const pantalones = [
    {
      id: 201,
      name: "Pantalón Jeans",
      price: "€59.99",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    },
    {
      id: 202,
      name: "Pantalón Chino",
      price: "€64.99",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    },
    {
      id: 203,
      name: "Pantalón Formal",
      price: "€79.99",
      image: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
    },
  ];

  return (
    <div className="container my-5">
      <h2 className="mb-4">Pantalones</h2>

      <div className="row g-4">
        {pantalones.map((item) => (
          <div key={item.id} className="col-12 col-sm-6 col-md-4">
            <div className="card h-100">
              <img src={item.image} className="card-img-top" alt={item.name} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.price}</p>

                <Link to={`/product/${item.id}`} className="btn btn-dark mt-auto">
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
import React from "react";
import { Link } from "react-router-dom";

export const Camisas = () => {
  const camisas = [
    {
      id: 101,
      name: "Camisa Blanca",
      price: "€49.99",
      image: "https://images.unsplash.com/photo-1520975958221-6d838c728e84",
    },
    {
      id: 102,
      name: "Camisa Azul",
      price: "€54.99",
      image: "https://images.unsplash.com/photo-1520975682034-13e77bfc8d1c",
    },
    {
      id: 103,
      name: "Camisa Formal",
      price: "€69.99",
      image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47",
    },
  ];

  return (
    <div className="container my-5">
      <h2 className="mb-4">Camisas</h2>

      <div className="row g-4">
        {camisas.map((item) => (
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
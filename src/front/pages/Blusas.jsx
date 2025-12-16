import { Link } from "react-router-dom";

export const Blusas = () => {
  const products = [
    {
      id: 1,
      name: "Blusa Elegante",
      price: "€49.99",
      image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0",
    },
    {
      id: 2,
      name: "Blusa Casual",
      price: "€39.99",
      image: "/Images/Mujer/Blusas/Blusa2.jpg",
    },
  ];

  return (
    <div className="container my-5">
      <h2 className="mb-4">Blusas</h2>

      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.price}</p>

              
                <Link
                  to={`/product/${product.id}`}
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
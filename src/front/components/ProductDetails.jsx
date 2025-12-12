
import React, { useState } from "react";
import { useParams, Link, useOutletContext } from "react-router-dom";


const products = [
  {
    id: 1,
    name: "Vestido Elegante Premium",
    price: 129.99,
    description:
      "Vestido elegante confeccionado con materiales de alta calidad. Perfecto para cualquier ocasión especial. Diseño moderno y sofisticado que se adapta a tu estilo.",
    images: [
      "https://images.pexels.com/photos/7691089/pexels-photo-7691089.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/7691189/pexels-photo-7691189.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/7691154/pexels-photo-7691154.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/7691092/pexels-photo-7691092.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Negro", value: "#000000" },
      { name: "Blanco", value: "#f5f5f5", border: true },
      { name: "Azul", value: "#4c7cff" },
      { name: "Beige", value: "#e6ddc4" },
    ],
    stock: 15,
  },
];

export const ProductDetails = () => {
  const { id } = useParams();

  const product = products.find((p) => p.id === Number(id)) || products[0];

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].value);
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  const handleIncrease = () => {
    setQuantity((q) => q + 1);
  };

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: `€${product.price.toFixed(2)}`,
      image: selectedImage,
      size: selectedSize,
      color: selectedColor,
    };

    const exists = cart.find(
      (p) =>
        p.id === productToAdd.id &&
        p.size === productToAdd.size &&
        p.color === productToAdd.color
    );

    if (exists) {
      const updated = cart.map((p) =>
        p.id === productToAdd.id &&
          p.size === productToAdd.size &&
          p.color === productToAdd.color
          ? { ...p, quantity: (p.quantity || 1) + quantity }
          : p
      );
      setCart(updated);
    } else {
      setCart((prev) => [...prev, { ...productToAdd, quantity }]);
    }
  };


  const handleBuyNow = () => {
    alert("Aquí iría el flujo de 'Comprar ahora' ");
  };



  const { cart, setCart } = useOutletContext();


  return (
    <div className="container my-5">

      {/* Botón VOLVER  */}
      <div className="mb-3">
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          ← Volver
        </Link>
      </div>

      <div className="row g-5">
        {/* Columna izquierda: imagen grande + miniaturas */}
        <div className="col-12 col-lg-6">

          <div
            className="mb-3"
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #e0e0e0",
            }}
          >
            <img
              src={selectedImage}
              alt={product.name}
              style={{
                width: "100%",
                height: "480px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>


          <div className="d-flex gap-3">
            {product.images.map((img, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImage(img)}
                className="border-0 p-0 bg-transparent"
                style={{
                  borderRadius: "6px",
                  overflow: "hidden",
                  border:
                    img === selectedImage
                      ? "2px solid #111827"
                      : "1px solid #e5e7eb",
                }}
              >
                <img
                  src={img}
                  alt={`Vista ${index + 1}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Columna derecha: info del producto */}
        <div className="col-12 col-lg-6">
          <h2 className="mb-2">{product.name}</h2>
          <h3 className="fw-semibold mb-3">
            €{product.price.toFixed(2)}
          </h3>

          <p className="text-secondary mb-4">{product.description}</p>

          {/* Tallas */}
          <div className="mb-4">
            <p className="fw-semibold mb-2">Talla</p>
            <div className="d-flex gap-2 flex-wrap">
              {product.sizes.map((size) => {
                const isActive = size === selectedSize;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`btn btn-sm ${isActive ? "btn-dark text-white" : "btn-outline-secondary"
                      }`}
                    style={{ minWidth: "48px" }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colores */}
          <div className="mb-4">
            <p className="fw-semibold mb-2">
              Color:{" "}
              <span className="text-secondary">
                {product.colors.find((c) => c.value === selectedColor)?.name}
              </span>
            </p>
            <div className="d-flex gap-3 align-items-center">
              {product.colors.map((color) => {
                const isActive = color.value === selectedColor;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className="border-0 bg-transparent p-0"
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: color.value,
                        border: color.border
                          ? "1px solid #9ca3af"
                          : "1px solid transparent",
                        boxShadow: isActive
                          ? "0 0 0 3px rgba(15,23,42,0.7)"
                          : "none",
                      }}
                    ></span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cantidad */}
          <div className="mb-3">
            <p className="fw-semibold mb-2">Cantidad</p>
            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleDecrease}
              >
                −
              </button>
              <span className="fw-semibold">{quantity}</span>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleIncrease}
              >
                +
              </button>
            </div>
          </div>

          {/* Stock */}
          <p className="text-success mb-4">
            Stock: {product.stock} unidades disponibles
          </p>

          {/* Botones de acción */}
          <div className="d-grid gap-3">
            <button
              type="button"
              className="btn btn-dark py-2"
              onClick={handleAddToCart}
            >
              Agregar al Carrito
            </button>
            <button
              type="button"
              className="btn btn-outline-dark py-2 bg-white"
              onClick={handleBuyNow}
            >
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
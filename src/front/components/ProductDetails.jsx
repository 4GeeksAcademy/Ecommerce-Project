import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { addToCart } from "../actions";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export const ProductDetails = () => {
  const { store, dispatch } = useGlobalReducer();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);


  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(`${BACKEND}/api/products/${id}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text}`);
        }

        const data = await res.json();
        setProduct(data);

     
        const main =
          data.gallery?.find((img) => img.is_main)?.url ||
          data.image_url ||
          data.gallery?.[0]?.url ||
          "";

        setSelectedImage(main);

       
        const first =
          (data.variants || []).find((v) => Number(v.stock) > 0) ||
          (data.variants || [])[0];

        if (first) {
          setSelectedSize(first.size);
          setSelectedColor(first.color);
        } else {
          setSelectedSize(null);
          setSelectedColor(null);
        }

        setQuantity(1);
      } catch (e) {
        console.error("Error loading product:", e);
        setProduct(null);
        setErrorMsg(e.message || "Error cargando producto");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const variants = product?.variants || [];

  
  const availableSizes = useMemo(() => {
    const set = new Set();
    variants.forEach((v) => {
      if (Number(v.stock) <= 0) return; // oculta sin stock
      if (selectedColor && v.color !== selectedColor) return;
      set.add(v.size);
    });
    return Array.from(set).sort();
  }, [variants, selectedColor]);

  const availableColors = useMemo(() => {
    const set = new Set();
    variants.forEach((v) => {
      if (Number(v.stock) <= 0) return; 
      if (selectedSize && v.size !== selectedSize) return;
      set.add(v.color);
    });
    return Array.from(set).sort();
  }, [variants, selectedSize]);

  useEffect(() => {
    if (selectedSize && availableSizes.length && !availableSizes.includes(selectedSize)) {
      setSelectedSize(null);
    }
  }, [availableSizes, selectedSize]);

  useEffect(() => {
    if (selectedColor && availableColors.length && !availableColors.includes(selectedColor)) {
      setSelectedColor(null);
    }
  }, [availableColors, selectedColor]);

  const selectedVariant = useMemo(() => {
    if (!selectedSize || !selectedColor) return null;
    return (
      variants.find((v) => v.size === selectedSize && v.color === selectedColor) || null
    );
  }, [variants, selectedSize, selectedColor]);

  
  const stockShown = selectedVariant ? Number(selectedVariant.stock || 0) : 0;

 
  const handleDecrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const handleIncrease = () => setQuantity((q) => q + 1);

  const handleAddToCart = async () => {
    if (!store?.auth?.isLoggedIn) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    if (!selectedVariant?.id) {
      alert("Selecciona talla y color.");
      return;
    }

    if (stockShown <= 0) {
      alert("No hay stock para esta variante.");
      return;
    }

    await addToCart(dispatch, store.auth.accessToken, selectedVariant.id, quantity);
  };

  const handleBuyNow = () => alert("Aquí iría el flujo de 'Comprar ahora'");

  if (loading) return <div className="container my-5">Cargando...</div>;
  if (errorMsg) return <div className="container my-5 alert alert-danger">{errorMsg}</div>;
  if (!product) return <div className="container my-5">Producto no encontrado</div>;

  return (
    <div className="container my-5">
      <div className="mb-3">
        <Link to="/products" className="btn btn-outline-secondary btn-sm">
          ← Volver
        </Link>
      </div>

      <div className="row g-5">
        {/* Izquierda: imagen + miniaturas */}
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

          <div className="d-flex gap-3 flex-wrap">
            {(product.gallery || [])
              .map((img) => img.url)
              .filter(Boolean)
              .map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className="border-0 p-0 bg-transparent"
                  style={{
                    borderRadius: "6px",
                    overflow: "hidden",
                    border: img === selectedImage ? "2px solid #111827" : "1px solid #e5e7eb",
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

        {/* Derecha: info */}
        <div className="col-12 col-lg-6">
          <h2 className="mb-2">{product.name}</h2>
          <h3 className="fw-semibold mb-3">€{Number(product.base_price).toFixed(2)}</h3>
          <p className="text-secondary mb-4">{product.description}</p>

          {/* Tallas */}
          <div className="mb-4">
            <p className="fw-semibold mb-2">Talla</p>
            <div className="d-flex gap-2 flex-wrap">
              {availableSizes.map((size) => {
                const isActive = size === selectedSize;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize((prev) => (prev === size ? null : size))}
                    className={`btn btn-sm ${
                      isActive ? "btn-dark text-white" : "btn-outline-secondary"
                    }`}
                    style={{ minWidth: "48px" }}
                  >
                    {size}
                  </button>
                );
              })}

              {!availableSizes.length && (
                <span className="text-muted small">No hay tallas disponibles</span>
              )}
            </div>
          </div>

          {/* Colores */}
          <div className="mb-4">
            <p className="fw-semibold mb-2">
              Color: <span className="text-secondary">{selectedColor || "—"}</span>
            </p>

            <div className="d-flex gap-2 flex-wrap">
              {availableColors.map((color) => {
                const isActive = color === selectedColor;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor((prev) => (prev === color ? null : color))}
                    className={`btn btn-sm ${
                      isActive ? "btn-dark text-white" : "btn-outline-secondary"
                    }`}
                  >
                    {color}
                  </button>
                );
              })}

              {!availableColors.length && (
                <span className="text-muted small">Elige una talla para ver colores</span>
              )}
            </div>
          </div>

          {/* Cantidad */}
          <div className="mb-3">
            <p className="fw-semibold mb-2">Cantidad</p>
            <div className="d-flex align-items-center gap-3">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleDecrease}>
                −
              </button>
              <span className="fw-semibold">{quantity}</span>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleIncrease}
                disabled={selectedVariant ? quantity >= stockShown : true}
              >
                +
              </button>
            </div>
          </div>

          {/* Stock */}
          <p className={`mb-4 ${stockShown > 0 ? "text-success" : "text-danger"}`}>
            Stock: {stockShown} unidades disponibles
          </p>

          {/* Botones */}
          <div className="d-grid gap-3">
            <button
              type="button"
              className="btn btn-dark py-2"
              onClick={handleAddToCart}
              disabled={!selectedVariant || stockShown <= 0}
            >
              Agregar al Carrito
            </button>

            <button type="button" className="btn btn-outline-dark py-2 bg-white" onClick={handleBuyNow}>
              Comprar Ahora
            </button>
          </div>

          {/* Debug útil */}
          <div className="small text-muted mt-3">
            Variante seleccionada:{" "}
            {selectedVariant
              ? `ID ${selectedVariant.id} (${selectedVariant.size}/${selectedVariant.color})`
              : "Ninguna"}
          </div>
        </div>
      </div>
    </div>
  );
};
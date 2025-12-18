import React, { useEffect, useMemo, useState } from "react";
import { Card } from "../components/Card.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { addToCart } from "../actions";

const BACKEND = import.meta.env.VITE_BACKEND_URL;


export const ProductsList = () => {
  const { store, dispatch } = useGlobalReducer();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [catWomen, setCatWomen] = useState(true);
  const [catMen, setCatMen] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const categoryQuery = useMemo(() => {

    if (catWomen && catMen) return null;
    if (!catWomen && !catMen) return "none";
    if (catWomen) return "Ropa Mujer";
    if (catMen) return "Ropa Hombre";
    return null;
  }, [catWomen, catMen]);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (categoryQuery && categoryQuery !== "none") params.set("category", categoryQuery);
    if (selectedSize) params.set("size", selectedSize);
    if (selectedColor) params.set("color", selectedColor);
    return params.toString();
  };

  const loadProducts = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const qs = buildQueryString();
      const url = `${BACKEND}/api/products${qs ? `?${qs}` : ""}`;

      const res = await fetch(url);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text}`);
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
      setErrorMsg(err.message || "Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();

  }, [categoryQuery, selectedColor, selectedSize]);



  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const variants = p.variants || [];

      if (selectedSize) {
        const ok = variants.some((v) => v.size === selectedSize);
        if (!ok) return false;
      }

      if (selectedColor) {
        const ok = variants.some((v) => v.color === selectedColor);
        if (!ok) return false;
      }

      return true;
    });
  }, [products, selectedSize, selectedColor]);


  const allVariants = useMemo(() => {
    const list = [];
    products.forEach((p) => {
      (p.variants || []).forEach((v) => {
        list.push({ size: v.size, color: v.color });
      });
    });
    return list;
  }, [products]);

  const availableSizes = useMemo(() => {
    const set = new Set();
    allVariants.forEach((v) => {
      if (selectedColor && v.color !== selectedColor) return;
      set.add(v.size);
    });
    return Array.from(set).sort();
  }, [allVariants, selectedColor]);

  const availableColors = useMemo(() => {
    const set = new Set();
    allVariants.forEach((v) => {
      if (selectedSize && v.size !== selectedSize) return;
      set.add(v.color);
    });
    return Array.from(set).sort();
  }, [allVariants, selectedSize]);

  const resetFilters = () => {
    setCatWomen(true);
    setCatMen(true);
    setSelectedSize(null);
    setSelectedColor(null);
  };

  const getProductImage = (p) => {
    const main = p.gallery?.find((img) => img.is_main)?.url;
    return main || p.image_url || p.gallery?.[0]?.url || "";
  };

  const handleAddToCart = async (product, quantity = 1) => {
    console.log(product)
    if (!store.auth.isLoggedIn) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }
    const variantId = product.variants?.[0]?.id;
    if (!variantId) {
      alert("Este producto no tiene variantes disponibles.");
      return;
    }
    await addToCart(dispatch, store.auth.accessToken, variantId, quantity);
  };

  return (
    <div className="container-fluid my-4">
      <div className="row">
        {/* FILTROS */}
        <aside className="col-12 col-md-3 col-lg-2 mb-4">
          <h5 className="fw-semibold mb-4">Filtros</h5>

          {/* CATEGORÍA */}
          <div className="mb-4">
            <h6 className="small fw-semibold mb-2">Categoría</h6>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="catWomen"
                checked={catWomen}
                onChange={(e) => setCatWomen(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="catWomen">
                Mujer
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="catMen"
                checked={catMen}
                onChange={(e) => setCatMen(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="catMen">
                Hombre
              </label>
            </div>

            <div className="form-text">
              {categoryQuery ? `Filtrando: ${categoryQuery}` : "Mostrando: Todas"}
            </div>
          </div>

          {/* TALLAS */}
          <div className="mb-4">
            <h6 className="small fw-semibold mb-2">Tallas</h6>
            <div className="d-flex flex-wrap gap-2">
              {(availableSizes.length ? availableSizes : ["XS", "S", "M", "L", "XL", "XXL"]).map(
                (size) => (
                  <button
                    key={size}
                    type="button"
                    className={`btn btn-sm ${selectedSize === size ? "btn-dark" : "btn-outline-dark"
                      }`}
                    onClick={() => setSelectedSize((prev) => (prev === size ? null : size))}
                  >
                    {size}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mb-4">
            <h6 className="small fw-semibold mb-2">Colores</h6>
            <div className="d-flex flex-wrap gap-2">
              {(availableColors.length ? availableColors : ["Negro", "Blanco", "Azul", "Amarillo", "Verde"]).map(
                (color) => (
                  <button
                    key={color}
                    type="button"
                    className={`btn btn-sm ${selectedColor === color ? "btn-dark" : "btn-outline-dark"
                      }`}
                    onClick={() => setSelectedColor((prev) => (prev === color ? null : color))}
                  >
                    {color}
                  </button>
                )
              )}
            </div>
          </div>

          <button className="btn btn-dark w-100 mt-2" onClick={loadProducts}>
            Aplicar filtros
          </button>

          <button className="btn btn-outline-dark w-100 mt-2" onClick={resetFilters}>
            Limpiar filtros
          </button>
        </aside>

        {/* LISTADO */}
        <section className="col-12 col-md-9 col-lg-10">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <h4 className="mb-2 mb-md-0">Todos los Productos</h4>
          </div>

          <div className="small text-muted mb-2">Total cargados: {filteredProducts.length}</div>

          {loading && <div className="text-muted">Cargando productos...</div>}
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          {!loading && !errorMsg && filteredProducts.length === 0 && (
            <div className="alert alert-secondary">No hay productos con esos filtros.</div>
          )}

          <div className="row g-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="col-6 col-md-4 col-lg-3 d-flex justify-content-center"
              >
                <Card
                  id={p.id}
                  name={p.name}
                  price={`€${Number(p.base_price).toFixed(2)}`}
                  image={getProductImage(p)}
                  onAddToCart={() => handleAddToCart(p)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
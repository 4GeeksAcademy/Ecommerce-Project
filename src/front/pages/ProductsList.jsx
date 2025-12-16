import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Card } from "../components/Card.jsx";

export const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const [catWomen, setCatWomen] = useState(true);
  const [catMen, setCatMen] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [onlyInStock, setOnlyInStock] = useState(false);

 
  const categoryQuery = useMemo(() => {
    if (catWomen && !catMen) return "Mujer";
    if (!catWomen && catMen) return "Hombre";
    return null;
  }, [catWomen, catMen]);


  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/products`;
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const getProductImage = (p) => {
    const main = p.gallery?.find((img) => img.is_main)?.url;
    return main || p.image_url || p.gallery?.[0]?.url || "";
  };

  
  const allVariants = useMemo(() => {
    const list = [];
    products.forEach((p) => {
      (p.variants || []).forEach((v) => {
        list.push({
          productId: p.id,
          category: p.category,
          size: v.size,
          color: v.color,
          stock: Number(v.stock || 0),
        });
      });
    });
    return list;
  }, [products]);

  // Tallas disponibles (dependiendo del color seleccionado)
  const availableSizes = useMemo(() => {
    const set = new Set();

    allVariants.forEach((v) => {
      // categoría
      if (categoryQuery && v.category !== categoryQuery) return;

      // stock
      if (onlyInStock && v.stock <= 0) return;

      // si hay color seleccionado, la talla debe existir con ese color
      if (selectedColor && v.color !== selectedColor) return;

      set.add(v.size);
    });

    return Array.from(set).sort();
  }, [allVariants, categoryQuery, onlyInStock, selectedColor]);

  //  Colores disponibles (dependiendo de la talla seleccionada)
  const availableColors = useMemo(() => {
    const set = new Set();

    allVariants.forEach((v) => {
      // categoría
      if (categoryQuery && v.category !== categoryQuery) return;

      // solo stock
      if (onlyInStock && v.stock <= 0) return;

      // si hay talla seleccionada, color debe existir con esa talla
      if (selectedSize && v.size !== selectedSize) return;

      set.add(v.color);
    });

    return Array.from(set).sort();
  }, [allVariants, categoryQuery, onlyInStock, selectedSize]);

  // Productos filtrados 
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1) categoría
      if (categoryQuery && p.category !== categoryQuery) return false;

      const variants = p.variants || [];

      // 2) talla
      if (selectedSize) {
        const ok = variants.some((v) => v.size === selectedSize);
        if (!ok) return false;
      }

      // 3) color
      if (selectedColor) {
        const ok = variants.some((v) => v.color === selectedColor);
        if (!ok) return false;
      }

      // 4) stock
      if (onlyInStock) {
        const ok = variants.some((v) => Number(v.stock || 0) > 0);
        if (!ok) return false;
      }

      return true;
    });
  }, [products, categoryQuery, selectedSize, selectedColor, onlyInStock]);

  
  const resetFilters = () => {
    setCatWomen(true);
    setCatMen(true);
    setSelectedSize(null);
    setSelectedColor(null);
    setOnlyInStock(false);
  };

  // Si seleccionas una talla que ya no existe por el color, la quito automáticamente
  useEffect(() => {
    if (selectedSize && availableSizes.length && !availableSizes.includes(selectedSize)) {
      setSelectedSize(null);
    }
  }, [availableSizes, selectedSize]);

  // Si seleccionas un color que ya no existe por la talla, lo quito automáticamente
  useEffect(() => {
    if (selectedColor && availableColors.length && !availableColors.includes(selectedColor)) {
      setSelectedColor(null);
    }
  }, [availableColors, selectedColor]);

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
                    className={`btn btn-sm ${
                      selectedSize === size ? "btn-dark" : "btn-outline-dark"
                    }`}
                    onClick={() => setSelectedSize((prev) => (prev === size ? null : size))}
                  >
                    {size}
                  </button>
                )
              )}
            </div>
          </div>

          {/* COLORES */}
          <div className="mb-4">
            <h6 className="small fw-semibold mb-2">Color</h6>
            <div className="d-flex flex-wrap gap-2">
              {(availableColors.length ? availableColors : ["Blanco", "Negro"]).map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`btn btn-sm ${
                    selectedColor === color ? "btn-dark" : "btn-outline-dark"
                  }`}
                  onClick={() => setSelectedColor((prev) => (prev === color ? null : color))}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* SOLO STOCK */}
          <div className="mb-4">
            <div className="form-check">
              <input
                id="inStock"
                className="form-check-input"
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="inStock">
                Solo con stock
              </label>
            </div>
          </div>

          {/* Botones */}
          <button className="btn btn-dark w-100 mt-2" onClick={loadProducts}>
            Recargar productos
          </button>

          <button className="btn btn-outline-dark w-100 mt-2" onClick={resetFilters}>
            Limpiar filtros
          </button>
        </aside>

        {/* LISTADO */}
        <section className="col-12 col-md-9 col-lg-10">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <h4 className="mb-2 mb-md-0">Todos los Productos</h4>

            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted">Ordenar por</span>
              <select className="form-select form-select-sm" style={{ maxWidth: "180px" }} disabled>
                <option>Más recientes</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          <div className="small text-muted mb-2">
            Total cargados: {filteredProducts.length}
          </div>

          {loading && <div className="text-muted">Cargando productos...</div>}

          {!loading && filteredProducts.length === 0 && (
            <div className="alert alert-secondary">No hay productos con esos filtros.</div>
          )}

          <div className="row g-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="col-6 col-md-4 col-lg-3 d-flex justify-content-center flex-column align-items-center"
              >
                <Card
                  id={p.id}
                  name={p.name}
                  price={`€${Number(p.base_price).toFixed(2)}`}
                  image={getProductImage(p)}
                />

                <div className="small text-muted mt-2">
                  Stock total: <span className="fw-semibold">{p.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
// Archivo para llamar acciones globales de la aplicación (llamadas al backend y dispatch al store)

// Carrito

export const loadCart = async (dispatch, token) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  dispatch({ type: "SET_CART", payload: data });
};

export const updateCartItem = async (dispatch, token, productId, quantity) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });
  const data = await res.json();
  dispatch({ type: "UPDATE_CART_ITEM", payload: data });
};

export const removeCartItem = async (dispatch, token, productId) => {
  await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  dispatch({ type: "REMOVE_CART_ITEM", payload: productId });
};



//producList

export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.category) params.set("category", filters.category);
  if (filters.size) params.set("size", filters.size);
  if (filters.color) params.set("color", filters.color);
  if (filters.in_stock) params.set("in_stock", "true");

  const qs = params.toString();
  const url = `/products${qs ? `?${qs}` : ""}`;

  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) throw new Error(`HTTP ${res.status} - ${text}`);

  // por si viene vacío
  if (!text) return [];

  const data = JSON.parse(text);

  // normaliza por si el backend retorna { products: [] } o { results: [] }
  if (Array.isArray(data)) return data;
  if (data?.products && Array.isArray(data.products)) return data.products;
  if (data?.results && Array.isArray(data.results)) return data.results;

  return [];
};


export const fetchProductDetail = async (productId) => {
  if (!productId) throw new Error("productId is required");

  const url = `/products/${productId}`;

  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) throw new Error(`HTTP ${res.status} - ${text}`);

  if (!text) return null;

  return JSON.parse(text);
};
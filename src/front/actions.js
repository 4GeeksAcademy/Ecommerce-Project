// Archivo para llamar acciones globales de la aplicación (llamadas al backend y dispatch al store)

// Carrito

// Obtener carrito del usuario
export const getCart = async (dispatch, token) => {
  dispatch({ type: "CART_LOADING" });
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("getCart failed:", res.status, text);
    dispatch({ type: "SET_CART", payload: { items: [] } });
    return;
  }
  const data = JSON.parse(text); // Cart.serialize() → { id, user_id, items: [...] }
  dispatch({ type: "SET_CART", payload: data });
};

// Añadir producto/variante al carrito
export const addToCart = async (dispatch, token, variantId, quantity) => {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  try {
    dispatch({ type: "CART_LOADING" });

    const res = await fetch(`${API_URL}/api/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        variant_id: variantId,
        quantity: quantity,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error al agregar al carrito:", errorData);
      return;
    }

    // Después de agregar, refrescar el carrito completo
    getCart(dispatch, token);
  } catch (err) {
    console.error("Error de red al agregar al carrito:", err);
  }
};

// Actualizar cantidad de un ítem
export const updateCartItem = async (dispatch, token, itemId, quantity) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/cart/item/${itemId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    }
  );
  const text = await res.text();
  if (!res.ok) {
    console.error("updateCartItem failed:", res.status, text);
    return;
  }
  // Refrescar el carrito completo
  getCart(dispatch, token);
};

// Eliminar ítem del carrito
export const deleteCartItem = async (dispatch, token, itemId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/cart/item/${itemId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const text = await res.text();
  if (!res.ok) {
    console.error("deleteCartItem failed:", res.status, text);
    return;
  }
  // Refrescar el carrito completo
  getCart(dispatch, token);
};

// Productos

export const loadProducts = async (dispatch) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
  const data = await res.json();
  dispatch({ type: "SET_PRODUCTS", payload: data });
};

export const loadCategories = async (dispatch) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
  const data = await res.json();
  dispatch({ type: "SET_CATEGORIES", payload: data });
};

export const loadProductDetail = async (dispatch, productId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`
  );
  const data = await res.json();
  dispatch({ type: "SET_PRODUCT_DETAIL", payload: data });
};

// Órdenes

export const loadUserOrders = async (dispatch, token) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  dispatch({ type: "SET_ORDERS", payload: data });
};

export const loadAdminOrders = async (dispatch, token) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await res.json();
  dispatch({ type: "SET_ADMIN_ORDERS", payload: data });
};



//producList

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
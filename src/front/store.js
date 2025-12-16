export const initialStore = () => {
  const token = localStorage.getItem("access_token");
  return {
    auth: {
      isLoggedIn: !!token,
      accessToken: token,
      user: JSON.parse(localStorage.getItem("user_data")) || null,
      isAdmin: false,
    },
    cart: {
      items: [],
      total: 0,
      count: 0,
      isLoading: false,
    },
    products: {
      list: [],
      categories: [],
      detail: null,
    },
    orders: {
      userOrders: [],
      adminOrders: [],
    },
    message: null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    // --- AUTENTICACIÓN ---
    case "LOGIN_SUCCESS":
      localStorage.setItem("access_token", action.payload.token);
      localStorage.setItem("user_data", JSON.stringify(action.payload.user));
      return {
        ...store,
        auth: {
          isLoggedIn: true,
          accessToken: action.payload.token,
          user: action.payload.user,
          isAdmin: action.payload.user.is_admin || false,
        },
      };

    case "LOGOUT":
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      return initialStore();

    case "PROFILE_LOADED":
      return {
        ...store,
        auth: {
          ...store.auth,
          user: action.payload,
        },
      };

    // --- CARRITO ---
    case "CART_LOADING":
      return {
        ...store,
        cart: { ...store.cart, isLoading: true },
      };

    case "SET_CART": {
      const payload = action.payload || {};
      const items = Array.isArray(payload.items) ? payload.items : [];
      const total = items.reduce((acc, it) => {
        const price =
          it.product?.base_price != null
            ? Number(it.product.base_price)
            : Number(it.product?.price ?? 0);
        return acc + price * (it.quantity || 1);
      }, 0);
      const count = items.reduce((acc, it) => acc + (it.quantity || 1), 0);

      return {
        ...store,
        cart: {
          ...store.cart,
          items,
          total,
          count,
          isLoading: false,
        },
      };
    }

    // --- PRODUCTOS ---
    case "SET_PRODUCTS":
      return {
        ...store,
        products: {
          ...store.products,
          list: Array.isArray(action.payload) ? action.payload : [],
        },
      };

    case "SET_CATEGORIES":
      return {
        ...store,
        products: {
          ...store.products,
          categories: Array.isArray(action.payload) ? action.payload : [],
        },
      };

    case "SET_PRODUCT_DETAIL":
      return {
        ...store,
        products: {
          ...store.products,
          detail: action.payload || null,
        },
      };

    // --- ÓRDENES ---
    case "SET_ORDERS":
      return {
        ...store,
        orders: {
          ...store.orders,
          userOrders: Array.isArray(action.payload) ? action.payload : [],
        },
      };

    case "SET_ADMIN_ORDERS":
      return {
        ...store,
        orders: {
          ...store.orders,
          adminOrders: Array.isArray(action.payload) ? action.payload : [],
        },
      };

    // --- MENSAJES ---
    case "SET_MESSAGE":
      return {
        ...store,
        message: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}

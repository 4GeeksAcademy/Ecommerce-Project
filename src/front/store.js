export const initialStore = () => {
  return {
    auth: {
      isLoggedIn: false,
      accessToken: localStorage.getItem("access_token") || null,
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

// 2. REDUCER
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
    case "SET_CART":
      return {
        ...store,
        cart: {
          ...store.cart,
          items: action.payload.items,
          total: action.payload.total,
          count: action.payload.items.length,
          isLoading: false,
        },
      };

    case "CART_LOADING":
      return {
        ...store,
        cart: {
          ...store.cart,
          isLoading: true,
        },
      };

    // --- PRODUCTOS ---
    case "SET_PRODUCTS":
      return {
        ...store,
        products: {
          ...store.products,
          list: action.payload,
        },
      };

    case "SET_CATEGORIES":
      return {
        ...store,
        products: {
          ...store.products,
          categories: action.payload,
        },
      };

    case "SET_PRODUCT_DETAIL":
      return {
        ...store,
        products: {
          ...store.products,
          detail: action.payload,
        },
      };

    // --- ÓRDENES ---
    case "SET_ORDERS":
      return {
        ...store,
        orders: {
          ...store.orders,
          userOrders: action.payload,
        },
      };

    case "SET_ADMIN_ORDERS":
      return {
        ...store,
        orders: {
          ...store.orders,
          adminOrders: action.payload,
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
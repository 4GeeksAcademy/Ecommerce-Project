import React from "react"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Favorites } from "./pages/Favorites";
import { ProductDetails } from "./components/ProductDetails";
import { ProductsList } from "./pages/ProductsList";
import { Admin } from "./pages/Admin";
import { AdminRoute } from "./pages/AdminRoute";
import { Variants } from "./pages/Variants";
import { Orders } from "./pages/Orders";
import { Users } from "./pages/Users";

import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Profile } from "./pages/Profile";
import { Carrito } from "./pages/Carrito";
import { Checkout } from "./pages/Checkout";

import { Comprar } from "./pages/Comprar";
import { Blusas } from "./pages/Blusas";
import { Faldas } from "./pages/Faldas";
import { Zapatos } from "./pages/Zapatos";

import { Camisas } from "./pages/Camisas";
import { Pantalones } from "./pages/Pantalones";
import { ZapatosHombre } from "./pages/ZapatosHombre";
import { SearchResults } from "./pages/SearchResults";


const logged = true;

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      <Route index element={<Home />} />
      <Route path="demo" element={<Demo />} />

      <Route path="products" element={<ProductsList />} />
      <Route path="product/:id" element={<ProductDetails />} />
      <Route path="single/:theId" element={<Single />} />
      <Route path="favorites" element={<Favorites />} /> 

      <Route path="mujer">
        <Route path="blusas" element={<Blusas />} />
        <Route path="faldas" element={<Faldas />} />
        <Route path="zapatos" element={<Zapatos />} />
      </Route>

      <Route path="hombre">
        <Route path="camisas" element={<Camisas />} />
        <Route path="pantalones" element={<Pantalones />} />
        <Route path="zapatos" element={<ZapatosHombre />} />
      </Route>


      <Route path="carrito" element={<Carrito />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="comprar" element={<Comprar />} />

      <Route path="favorites" element={<Favorites />} />
      <Route path="admin" element={<Admin />}>
        <Route path="variants" element={<Variants />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
      </Route>
      <Route path="/admin/*"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
      <Route path="/search-results" element={<SearchResults />} />


      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />

      {logged
        ? <Route path="profile" element={<Profile />} />
        : <Route path="profile" element={<Navigate to="/login" />} />
      }

    </Route>
  )
);
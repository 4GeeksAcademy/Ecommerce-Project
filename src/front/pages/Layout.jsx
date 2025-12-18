import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { DemoNav } from "../components/DemoNav";

export const Layout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <ScrollToTop>
      <div className="d-flex flex-column min-vh-100">
        <Navbar
          cart={cart}
          setCart={setCart}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

       
        <main className="flex-grow-1">
          <Outlet context={{ cart, setCart, searchTerm, setSearchTerm }} />
        </main>

        {!isAdmin && <Footer />}
        {!isAdmin && <DemoNav />}
      </div>
    </ScrollToTop>
  );
};


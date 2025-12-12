import React from "react";
import { GoAlert } from "react-icons/go";
import { Link } from "react-router-dom";

export const DemoNav = () => {
    return (
        <div
            className="demo-nav shadow-lg"
            style={{
                position: "fixed",
                right: "1.5rem",
                bottom: "1.5rem",
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "1.5rem",
                padding: "1.5rem 1.2rem",
                zIndex: 1050,
                maxWidth: "220px",
            }}
        >
            <h6 className="mb-3 text-center">Demo Navigation:</h6>

            <div className="d-flex flex-column gap-2">
                <Link to="/" className="btn btn-light btn-sm">
                    Home
                </Link>

                <Link to="/products" className="btn btn-light btn-sm">
                    Products List
                </Link>

                <Link to="/product/1" className="btn btn-light btn-sm">
                    Product Detail
                </Link>

                <Link to="/carrito" className="btn btn-light btn-sm">
                    Cart
                </Link>

                <Link to="/checkout" className="btn btn-light btn-sm">
                    Checkout
                </Link>

                <Link to="/admin" className="btn btn-light btn-sm">
                    Admin
                </Link>
               
            </div>
        </div>
    );
};
import React, { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";

export const Carrito = () => {
    const { cart, setCart } = useOutletContext();


    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };


    const [quantities, setQuantities] = useState({});


    useEffect(() => {
        const initialQuantities = cart.reduce((acc, product) => {
            acc[product.id] = product.quantity || 1;
            return acc;
        }, {});
        setQuantities(initialQuantities);
    }, [cart]);

    //decrementa cantidad
    const handleDecrease = (id) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, prev[id] - 1),
        }));
    };

    //incrementa cantidad
    const handleIncrease = (id) => {
        setQuantities(prev => ({
            ...prev,
            [id]: prev[id] + 1,
        }));
    };

    //calcular subtotal
    const subtotal = cart.reduce((acc, product) => {
        const price = parseFloat(product.price.toString().replace("€", ""));
        const quantity = quantities[product.id] || product.quantity || 1;
        return acc + price * quantity;
    }, 0);

    return (
        <div className="container my-5">
            <p className="mb-4">Carrito de Compras</p>

            <div className="row">

                <div className="col-12 col-lg-8">
                    {cart.length === 0 ? (
                        <p>Su carrito está vacío</p>
                    ) : (
                        <div className="d-flex flex-column gap-4">

                            {cart.map(product => (
                                <div key={product.id} className="p-3 bg-white rounded shadow-sm d-flex gap-3">
                                    <img src={product.image} alt={product.name} style={{ width: "120px", height: "140px", objectFit: "cover", borderRadius: "8px", }} />

                                    <div className="flex-grow-1">

                                        <h5 className="mb-1">{product.name}</h5>
                                        <p className="text-muted mb-2">Talla: {product.size || "-"} | Color: {product.color || "-"}</p>
                                        <p className="fw-semibold">€{product.price}</p>

                                        <div className="d-flex align-items-center gap-3 mt-2">
                                            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => handleDecrease(product.id)}> -
                                            </button>
                                            <span className="fw-semibold">{quantities[product.id] || product.quantity || 1}</span>
                                            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => handleIncrease(product.id)}>+
                                            </button>
                                            <button className="btn btn-link text-danger ms-3" onClick={() => removeFromCart(product.id)} >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>

                                    </div>

                                    <div className="fw-semibold" style={{ minWidth: "90px" }}> € {(parseFloat(product.price.toString().replace("€", "")) * (quantities[product.id] || product.quantity || 1)).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-12 col-lg-4 mt-4 mt-lg-0">
                    <div className="p-4 bg-white rounded shadow-sm">
                        <h5 className="mb-3">Resumen del Pedido</h5>

                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Subtotal</span>
                            <span>€{subtotal.toFixed(2)}</span>
                        </div>

                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-muted">Envío</span>
                            <span>€0.00</span>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between mb-3 fw-semibold">
                            <span>Total</span>
                            <span>€{subtotal.toFixed(2)}</span>
                        </div>

                        <Link to="/checkout">
                            <button className="btn btn-dark w-100 mb-2">Ir al Checkout</button>
                        </Link>

                        <Link to="/login">
                            <button className="btn btn-outline-dark w-100">
                                Continuar Comprando
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

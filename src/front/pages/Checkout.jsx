import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Checkout = () => {

    const { cart, setCart } = useOutletContext();
    const navigate = useNavigate();

    //Datos del form
    const [formData, setFormData] = useState({
        nombre: "",
        direccion: "",
        comuna: "",
        ciudad: "",
        region: "",
        pais: "",
        postal: "",
        telefono: "",
        metodoPago: "tarjeta"
    });

    //resumen pedido

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const subtotal = cart.reduce((acc, product) => {
        const price = parseFloat(product.price.toString().replace("€", ""));
        const quantity = product.quantity || 1;
        return acc + price * quantity;
    }, 0);

    const shipping = 9.99;
    const total = subtotal + shipping;

    //carrito

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos de envío:", formData);
        console.log("Carrito:", cart);

        setCart([]);
        navigate("/comprar")
    };

    return (
        <div className="container my-5">
            <p className=" text-body-secondary">Finalizar la compra</p>

            <div className="row">

                <div className="col-12 col-lg-8">
                    <h3 className="mb-4">Información de Envío</h3>

                    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">

                        <div className="mb-3">
                            <label className="form-label"> Nombre Completo </label>
                            <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label"> Dirección (Avenida / Calle / Número de casa o departamento)</label>
                            <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} required />
                        </div>

                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Comuna</label>
                                <input type="text" className="form-control" name="comuna" value={formData.comuna} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Ciudad</label>
                                <input type="text" className="form-control" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Región</label>
                                <input type="text" className="form-control" name="region" value={formData.region} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">País</label>
                                <input type="text" className="form-control" name="pais" value={formData.pais} onChange={handleChange} required />
                            </div>

                        </div>

                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Código Postal </label>
                                <input type="text" pattern="[0-9]*" className="form-control" name="postal" value={formData.postal} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Teléfono </label>
                                <input type="tel" pattern="[0-9]+" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} required />
                            </div>

                        </div>

                        <h5 className="mt-4">Método de Pago</h5>

                        <div className="mt-2">

                            <div className="form-check mb-2">

                                <input className="form-check-input" type="radio" name="metodoPago" value="tarjeta" checked={formData.metodoPago === "tarjeta"} onChange={handleChange} id="metodo-tarjeta" />

                                <label className="form-check-label" htmlFor="metodo-tarjeta">
                                    Tarjeta de Crédito / Débito
                                </label>
                            </div>

                            <div className="form-check mb-2">
                                <input className="form-check-input" type="radio" name="metodoPago" value="paypal" checked={formData.metodoPago === "paypal"} onChange={handleChange} id="metodo-paypal" />
                                <label className="form-check-label" htmlFor="metodo-paypal">
                                    PayPal
                                </label>
                            </div>

                            <div className="form-check mb-2">
                                <input className="form-check-input" type="radio" name="metodoPago" value="transferencia" checked={formData.metodoPago === "transferencia"} onChange={handleChange}
                                    id="metodo-transferencia" />

                                <label className="form-check-label" htmlFor="metodo-transferencia"> Transferencia Bancaria</label>
                            </div>

                        </div>
                        <button type="submit" className="btn btn-dark mt-4 w-100"> Comprar </button>

                    </form>
                </div>

                <div className="col-12 col-lg-4 mt-4 mt-lg-0">
                    <div className="p-4 bg-white rounded shadow-sm">
                        <h5 className="mb-3">Resumen del Pedido</h5>

                        {cart.map(product => (
                            <div key={product.id} className="d-flex justify-content-between mb-2">
                                <span>
                                    {product.name} × {product.quantity || 1}
                                </span>
                                <span>
                                    €{(
                                        parseFloat(product.price.toString().replace("€", "")) *
                                        (product.quantity || 1)
                                    ).toFixed(2)}
                                </span>
                            </div>
                        ))}

                        <hr />

                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Subtotal</span>
                            <span>€{subtotal.toFixed(2)}</span>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Envío</span>
                            <span>€{shipping.toFixed(2)}</span>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between fw-semibold mb-3">
                            <span>Total</span>
                            <span>€{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

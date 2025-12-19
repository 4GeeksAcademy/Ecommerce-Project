import React from "react";
import { Link } from "react-router-dom";
import { PiShoppingBagOpenThin } from "react-icons/pi";
import { RiUserHeartFill } from "react-icons/ri";
import { MdOutlineLocalShipping } from "react-icons/md";
import { Carousel } from "../components/Carousel";


export const Comprar = () => {

    return (

        <div className="compra-container w-100">
            <Carousel />

            <div className="compra-final mt-5 text-center">

                <h2 className="">¡Su pedido ha sido procesado con éxito!</h2>

                <br></br>

                <p>Revise su e-mail para hacerle seguimiento al envío <MdOutlineLocalShipping /></p>

                <PiShoppingBagOpenThin className="" style={{ fontSize: "300px" }} />

                <h3>Gracias por preferirnos <RiUserHeartFill /></h3>

                <Link to="/" className="link-info">Volver al inicio</Link>
            </div>
        </div>
    )
}
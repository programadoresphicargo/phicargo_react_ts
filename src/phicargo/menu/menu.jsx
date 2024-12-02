import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import MenuItem from "./menuitem";
import React from "react";
const { VITE_PHIDES_API_URL } = import.meta.env;

const menuItems = [
    { icon: "turnos.png", label: "Turnos", link: "/terminales" },
    { icon: "viajes.png", label: "Control de viajes", link: "/viajes" },
    { icon: "maniobras.png", label: "Maniobras", link: "/cartas-porte" },
    { icon: "monitoreo.png", label: "Monitoreo", link: "/monitoreo" },
    { icon: "accesos.png", label: "Accesos", link: "/accesos" },
    { icon: "bonos.png", label: "Bonos", link: "/bonos" },
    { icon: "ajustes.png", label: "Bonos", link: "/ajustes" },
];

const Menu = () => {
    return (

        <main id="content" role="main" class="main">
            <div
                className="position-fixed top-0 end-0 start-0 bg-img-start"
                style={{
                    height: '32rem',
                    backgroundImage: `url(${VITE_PHIDES_API_URL}/img/fondo7.svg)`,
                }}
            >
                <div className="shape shape-bottom zi-1">
                    <svg
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 1921 273"
                    >
                        <polygon fill="#fff" points="0,273 1921,273 1921,0" />
                    </svg>
                </div>
            </div>


            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh', // Ocupa toda la altura de la pantalla
                    width: '100vw', // Ocupa todo el ancho de la pantalla
                    border: '2px solid red',
                }}
            >
                <div className="container">
                    <div className="row d-flex justify-content-center align-items-center mb-5">
                        <div className="col-12 d-flex justify-content-center">
                            <img
                                src="https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png"
                                height="370px"
                                width="370px"
                                alt="Logo Phi Cargo"
                                style={{
                                    zIndex: '10000',
                                }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                className="col-6 col-sm-6 col-md-4 col-lg-2"
                                style={{
                                    zIndex: '10000',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: '20px',
                                }}
                            >
                                <MenuItem
                                    icon={item.icon}
                                    label={item.label}
                                    link={item.link}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>

    );
};

export default Menu;

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import MenuItem from "./menuitem";
import React from "react";
import accesos_img from '../../assets/menu/accesos.png'
import ajustes_img from '../../assets/menu/ajustes.png';
import bonos_img from '../../assets/menu/bonos.png';
import imglogo from '../../assets/img/tract_scannia.jpg';
import maniobras_img from '../../assets/menu/maniobras.png';
import monitoreo_img from '../../assets/menu/monitoreo.png';
import operadores_img from '../../assets/menu/operadores.png';
import turnos_img from '../../assets/menu/turnos.png';
import usuarios_img from '../../assets/menu/usuarios.png';
import viajes_img from '../../assets/menu/viajes.png';
import zIndex from "@mui/material/styles/zIndex";

const { VITE_PHIDES_API_URL } = import.meta.env;

const menuItems = [
    { icon: turnos_img, label: "Turnos", link: "/terminales" },
    { icon: viajes_img, label: "Viajes", link: "/viajes" },
    { icon: maniobras_img, label: "Maniobras", link: "/cartas-porte" },
    { icon: monitoreo_img, label: "Monitoreo", link: "/monitoreo" },
    { icon: accesos_img, label: "Accesos", link: "/accesos" },
    { icon: bonos_img, label: "Bonos", link: "/bonos" },
    { icon: usuarios_img, label: "Usuarios", link: "/control-usuarios" },
    { icon: operadores_img, label: "Operadores", link: "/controloperadores" },
    { icon: ajustes_img, label: "Usuarios", link: "/ajustes" },
    { icon: viajes_img, label: "Disponibilidad", link: "/disponibilidad" },
];

const Menu = () => {

    const value = sessionStorage.getItem('session');
    if (value) {
        console.log('Valor obtenido:', value);
    } else {
        console.log('No se encontró el valor en sessionStorage.');
    }

    return (

        <main id="content" role="main" class="main">
            <div
                className="position-fixed top-0 end-0 start-0 bg-img-start"
                style={{
                    height: '32rem',
                    background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 400"><rect width="1920" height="400" fill="%23D9DEEA" /><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="400"><rect width="1920" height="400" fill="%23D9DEEA" /></mask><g mask="url(%23mask0)"><path d="M1059.48 308.024C1152.75 57.0319 927.003 -103.239 802.47 -152.001L1805.22 -495.637L2095.53 351.501L1321.23 616.846C1195.12 618.485 966.213 559.015 1059.48 308.024Z" fill="%23C0CBDD" /><path d="M1333.22 220.032C1468.66 -144.445 1140.84 -377.182 960 -447.991L2416.14 -947L2837.71 283.168L1713.32 668.487C1530.19 670.868 1197.78 584.509 1333.22 220.032Z" fill="%238192B0" /></g></svg>')`,
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
                }}
            >
                <div className="container">
                    <div className="row d-flex justify-content-center align-items-center mb-5">
                        <div className="col-12 d-flex justify-content-center">
                            <img
                                src="https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png"
                                height="400px"
                                width="400px"
                                alt="Logo Phi Cargo"
                                style={{ zIndex: '200000000' }}
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
        </main >

    );
};

export default Menu;

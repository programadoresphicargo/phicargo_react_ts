import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import MenuItem from './menuitem';
import React from 'react';
import accesos_img from '../../assets/menu/accesos.png';
import ajustes_img from '../../assets/menu/ajustes.png';
import bonos_img from '../../assets/menu/bonos.png';
import correo_img from '../../assets/menu/correo.png'
import imglogo from '../../assets/img/tract_scannia.jpg';
import maniobras_img from '../../assets/menu/maniobras.png';
import monitoreo_img from '../../assets/menu/monitoreo.png';
import operadores_img from '../../assets/menu/operadores.png';
import reportesImg from '../../assets/menu/reportes.png'
import turnos_img from '../../assets/menu/turnos.png';
import usuarios_img from '../../assets/menu/usuarios.png';
import viajes_img from '../../assets/menu/viajes.png';
import { useEffect } from 'react';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import AvatarProfile from '../modules/core/components/ui/AvatarProfile';
const { VITE_PHIDES_API_URL } = import.meta.env;

const menuItems = [
  { icon: turnos_img, label: 'Turnos', link: '/terminales' },
  { icon: viajes_img, label: 'Control de viajes', link: '/viajes' },
  { icon: maniobras_img, label: 'Maniobras', link: '/cartas-porte' },
  { icon: monitoreo_img, label: 'Monitoreo', link: '/monitoreo' },
  { icon: accesos_img, label: 'Accesos', link: '/accesos' },
  { icon: bonos_img, label: 'Bonos', link: '/bonos' },
  { icon: usuarios_img, label: 'Usuarios', link: '/control-usuarios' },
  { icon: operadores_img, label: 'Operadores', link: '/controloperadores' },
  { icon: viajes_img, label: 'Disponibilidad', link: '/disponibilidad' },
  { icon: correo_img, label: 'Correos electronicos', link: '/CorreosElectronicos' },
  { icon: reportesImg, label: 'Reportes', link: '/reportes' },
];

const Menu = () => {

  const startSession = async () => {
    try {
      const response = await fetch(VITE_PHIDES_API_URL + '/login/inicio/start_session.php', {
        method: "POST",
        credentials: "include", // Habilitar envío de cookies
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const getSession = async () => {
    try {
      const response = await fetch(VITE_PHIDES_API_URL + '/login/inicio/get_user.php', {
        method: "GET",
        credentials: "include", // Habilitar envío de cookies
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error getting session:", error);
    }
  };

  startSession();
  getSession();

  return (
    <main id="content" role="main" className="main">

      <AppBar
        position="absolute"
        elevation={0}
        sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Menú
          </Typography>
          <AvatarProfile></AvatarProfile>
        </Toolbar>
      </AppBar>

      <div
        className="fixed top-0 left-0 right-0 bg-cover bg-no-repeat"
        style={{
          height: '32rem',
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 400"><rect width="1920" height="400" fill="%23D9DEEA" /><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="400"><rect width="1920" height="400" fill="%23D9DEEA" /></mask><g mask="url(%23mask0)"><path d="M1059.48 308.024C1152.75 57.0319 927.003 -103.239 802.47 -152.001L1805.22 -495.637L2095.53 351.501L1321.23 616.846C1195.12 618.485 966.213 559.015 1059.48 308.024Z" fill="%23C0CBDD" /><path d="M1333.22 220.032C1468.66 -144.445 1140.84 -377.182 960 -447.991L2416.14 -947L2837.71 283.168L1713.32 668.487C1530.19 670.868 1197.78 584.509 1333.22 220.032Z" fill="%238192B0" /></g></svg>')`,
        }}
      >
        <div className="shape-bottom absolute inset-x-0 bottom-0">
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

      <div className="flex justify-center items-center h-screen w-screen">
        <div className="container mx-auto">
          <div className="flex justify-center items-center mb-5">
            <div className="flex justify-center">
              <img
                src="https://phi-cargo.com/wp-content/uploads/2021/05/logo-phicargo-vertical.png"
                height="400px"
                width="400px"
                alt="Logo Phi Cargo"
                className="z-[200000000]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-center items-center"
                style={{ zIndex: '10000' }}
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


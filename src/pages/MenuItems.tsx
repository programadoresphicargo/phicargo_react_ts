import accesos_img from '../assets/menu/accesos.png';
import bonos_img from '../assets/menu/bonos.png';
import calendar3d from '../assets/menu/calendar3d.png';
import ce_img from '../assets/menu/costos_extras.png';
import dashboardIcon from '../assets/menu/dashboardIcon.png';
import maniobras_img from '../assets/menu/maniobras.png';
import monitoreo_img from '../assets/menu/monitoreo.png';
import complaints from '../assets/menu/complaints.png';
import minutas from '../assets/menu/minutas.png';
import incidentsImg from '../assets/menu/incidents.png';
import reportesImg from '../assets/menu/reportes.png';
import shipingcontainer from '../assets/menu/shiping-container.png';
import turnos_img from '../assets/menu/turnos.png';
import usuarios_img from '../assets/menu/usuarios.png';
import viajes_img from '../assets/menu/viajes.png';
import almacen from '../assets/menu/almacen.png';
import chatbot from '../assets/menu/chatbot.png';
import ti from '../assets/menu/laptop.png';
import ajustes from '../assets/menu/ajustes.png';

export type MenuItemType = {
 icon: string;
 label: string;
 link: string;
 requiredPermissions: number[];
};

export const menuItems: MenuItemType[] = [
 {
  icon: turnos_img,
  label: 'Turnos',
  requiredPermissions: [202],
  link: '/turnos',
 },
 {
  icon: viajes_img,
  label: 'Viajes',
  link: '/viajes',
  requiredPermissions: [1],
 },
 {
  icon: maniobras_img,
  label: 'Maniobras',
  link: '/control_maniobras',
  requiredPermissions: [38],
 },
 {
  icon: monitoreo_img,
  label: 'Monitoreo',
  link: '/EventosPendientes',
  requiredPermissions: [40],
 },
 {
  icon: accesos_img,
  label: 'Accesos',
  link: '/accesos',
  requiredPermissions: [126],
 },
 {
  icon: bonos_img,
  label: 'Bonos',
  requiredPermissions: [3],
  link: '/bonos',
 },
 {
  icon: usuarios_img,
  label: 'Usuarios',
  link: '/control-usuarios',
  requiredPermissions: [5],
 },
 {
  icon: viajes_img,
  label: 'Operadores y Unidades',
  link: '/disponibilidad',
  requiredPermissions: [200],
 },
 {
  icon: reportesImg,
  label: 'Reportes',
  link: '/reportes',
  requiredPermissions: [4],
 },
 {
  icon: ce_img,
  label: 'Costos extras',
  link: '/folios_costos_extras',
  requiredPermissions: [130],
 },
 {
  icon: dashboardIcon,
  label: 'Dashboard',
  link: '/dashboards',
  requiredPermissions: [203],
 },
 {
  label: 'Disponibilidad',
  link: '/operaciones-diarias',
  icon: calendar3d,
  requiredPermissions: [201],
 },
 {
  icon: shipingcontainer,
  label: 'Servicios',
  link: '/servicios',
  requiredPermissions: [204],
 },
 {
  icon: almacen,
  label: 'Almacen',
  link: '/solicitudes_epp',
  requiredPermissions: [300],
 },
 {
  icon: complaints,
  label: 'No conformidades',
  link: '/quejas',
  requiredPermissions: [213],
 },
 {
  icon: minutas,
  label: 'Minutas',
  link: '/minutas',
  requiredPermissions: [782],
 },
 {
  icon: incidentsImg,
  label: 'Incidencias',
  link: '/incidencias',
  requiredPermissions: [214, 215, 216, 217],
 },
 {
  icon: chatbot,
  label: 'Chat',
  link: '/chatbot',
  requiredPermissions: [700],
 },
 {
  icon: ti,
  label: 'Sistemas',
  link: '/celulares',
  requiredPermissions: [701],
 },
 {
  icon: ajustes,
  label: 'Ajustes',
  link: '/onedrive_ajutes',
  requiredPermissions: [701],
 },
];

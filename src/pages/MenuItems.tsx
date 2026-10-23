import accesos_img from '../assets/menu/accesos.png';
import bonos_img from '../assets/menu/bonos.png';
import calendar from '../assets/menu/calendario.png';
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
import maintenance_img from '../assets/menu/maintenanceIcon.png';
import viajesIcon from '../assets/menu/viajes.png';
import calendarIcon from '../assets/menu/calendario.png';
import kmIcon from '../assets/menu/calle.png';
import containerIcon from '../assets/menu/shiping-container.png';
import idealeaseIcon from '../assets/menu/idealease.png';
import ganttIcon from '../assets/menu/gantt.png';
import preventivosIcon from '../assets/menu/calendar_maintenance.png';
import balanceIcon from '../assets/menu/balanceIcon.png';
import clockIcon from '../assets/menu/clock.png';
import detencionesIcon from '../assets/menu/detenciones.png';
import estadiasIcon from '../assets/menu/estadias.png';
import maintenanceIcon from '../assets/menu/maintenanceIcon.png';
import phoneIcon from '../assets/menu/app.png';
import reportIcon from '../assets/menu/reportes.png';
import revenueIcon from '../assets/menu/revenue.png';
import licenciaIcon from '../assets/menu/licencia.png';
import aptoIcon from '../assets/menu/apto.png';
import survey from '../assets/menu/survey.png';

export type MenuItemType = {
 icon: string;
 label: string;
 link?: string;
 requiredPermissions: number[];
 children?: MenuItemType[];
};

export const menuItems: MenuItemType[] = [
 {
  icon: viajes_img,
  label: 'Operaciones',
  requiredPermissions: [1],
  link: '/viajes',
  children: [
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
    icon: ce_img,
    label: 'Costos extras',
    link: '/folios_costos_extras',
    requiredPermissions: [130],
   },
   {
    label: 'Disponibilidad',
    link: '/operaciones-diarias',
    icon: calendar,
    requiredPermissions: [201],
   },
   {
    icon: shipingcontainer,
    label: 'Servicios',
    link: '/servicios',
    requiredPermissions: [204],
   },
  ]
 },
 {
  icon: accesos_img,
  label: 'Accesos',
  link: '/accesos',
  requiredPermissions: [126],
 },
 {
  icon: maintenance_img,
  label: 'Mantenimiento',
  link: '/mantenimiento',
  requiredPermissions: [],
  children: [
   {
    label: 'Mantenimiento',
    link: '/reportes/mantenimiento',
    icon: maintenanceIcon,
    requiredPermissions: [198],
   },
   {
    label: 'Preventivos',
    link: '/reportes/preventivos',
    icon: preventivosIcon,
    requiredPermissions: [198],
   },
  ],
 },
 {
  icon: bonos_img,
  label: 'Bonos',
  requiredPermissions: [3],
  link: '/bonos',
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
  requiredPermissions: [4],
  children: [
   {
    label: 'Flota',
    link: '/reportes/flota/',
    icon: viajesIcon,
    requiredPermissions: [],
   },
   {
    label: 'Reporte gerencial',
    link: '/reportes/saldos/',
    icon: reportIcon,
    requiredPermissions: [190],
   },
   {
    label: 'Proyección',
    link: '/reportes/proyeccion',
    icon: revenueIcon,
    requiredPermissions: [207],
   },
   {
    label: 'Balance',
    link: '/reportes/balance',
    icon: balanceIcon,
    requiredPermissions: [197],
   },
   {
    label: 'Tiempos de salidas y llegadas viajes',
    link: '/detenciones',
    icon: clockIcon,
    requiredPermissions: [209],
   },
   {
    label: 'Cumplimiento estatus App',
    link: '/reportes/cumplimiento',
    icon: phoneIcon,
    requiredPermissions: [210],
   },
   {
    label: 'Reporte de estadias',
    link: '/estadias',
    icon: estadiasIcon,
    requiredPermissions: [211],
   },
   {
    label: 'Reporte de detenciones',
    link: '/reporte_detenciones',
    icon: detencionesIcon,
    requiredPermissions: [0],
   },
   {
    label: 'Unidades vacantes',
    link: '/reportes/unidades_vacantes',
    icon: viajesIcon,
    requiredPermissions: [289],
   },
   {
    label: 'Licencias próximas a vencer',
    link: '/reportes/licencias_vencidas',
    icon: licenciaIcon,
    requiredPermissions: [520],
   },
   {
    label: 'Aptos medicos próximos a vencer',
    link: '/reportes/aptos_medicos',
    icon: aptoIcon,
    requiredPermissions: [520],
   },
   {
    label: 'Viajes por tipo de armado',
    link: '/reportes/viajes_tipo_armado',
    icon: viajesIcon,
    requiredPermissions: [288],
   },
   {
    label: 'Último uso equipos',
    link: '/disponibilidad/ultimos_usos',
    icon: calendarIcon,
    requiredPermissions: [211],
   },
   {
    label: 'KM Recorridos',
    link: '/reportes/km_recorridos',
    icon: kmIcon,
    requiredPermissions: [288],
   },
   {
    label: 'Servicios por categoría',
    link: '/reportes/servicios_categoria',
    icon: containerIcon,
    requiredPermissions: [288],
   },
   {
    label: 'Unidades en taller IDEALEASE',
    link: '/reportes/unidades_taller',
    icon: idealeaseIcon,
    requiredPermissions: [288],
   },
   {
    label: 'Ocupación diaria flota',
    link: '/reportes/disponibilidad_diaria_flota',
    icon: ganttIcon,
    requiredPermissions: [402],
   },
   {
    label: 'Ocupación diaria operadores',
    link: '/reportes/disponibilidad_diaria_operadores',
    icon: ganttIcon,
    requiredPermissions: [402],
   },
   {
    label: 'Flota 2',
    link: '/reportes/vehiculos_agrupados',
    icon: viajesIcon,
    requiredPermissions: [288],
   },
  ],
 },
 {
  icon: dashboardIcon,
  label: 'Dashboard',
  link: '/dashboards',
  requiredPermissions: [203],
 },
 {
  icon: almacen,
  label: 'Almacen',
  link: '/solicitudes_epp',
  requiredPermissions: [300],
 },
 {
  icon: complaints,
  label: 'Calidad',
  requiredPermissions: [213],
  children: [
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
    icon: survey,
    label: 'Encuestas Comercial',
    link: '/quejas/surveys',
    requiredPermissions: [782],
   }
  ]
 },
 {
  icon: incidentsImg,
  label: 'Incidencias',
  link: '/incidencias',
  requiredPermissions: [214, 215, 216, 217, 444],
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
  requiredPermissions: [701],
  children: [
   {
    icon: ajustes,
    label: 'Ajustes',
    link: '/onedrive_ajutes',
    requiredPermissions: [701],
   },
   {
    icon: usuarios_img,
    label: 'Usuarios',
    link: '/control-usuarios',
    requiredPermissions: [5],
   },
  ],
 },
];

export const pages = [
 { name: 'ACTIVOS', path: '/viajes', permiso: 500 },
 { name: 'FINALIZADOS', path: '/viajesfinalizados', permiso: 501 },
 { name: 'PROGRAMACIÓN', path: '/viajesprogramados', permiso: 502 },
 { name: 'CORREOS', path: '/CorreosElectronicos', permiso: 103 },
 {
  name: 'ESTADIAS', permiso: 503,
  subpages: [
   { name: 'Estadías', path: '/estadias' },
   { name: 'Periodos de pago', path: '/periodos_pagos_estadias_operadores' },
   { name: 'Folios de pago estadias operadores', path: '/pagos_estadias_operadores' },
  ],
 },
 {
  name: 'ESTATUS OPERATIVOS', permiso: 500,
  subpages: [
   { name: 'Control de estatus', path: '/controlestatus' },
   { name: 'Reporte cumplimiento por horas', path: '/cumplimiento_estatus_ejecutivos' },
   { name: 'Reporte cumplimiento por porcentaje ', path: '/cumplimiento_estatus_viajes_general' },
   { name: 'Codigos postales', path: '/codigos_postales' },
   { name: 'GEOCERCAS', path: '/geocercas', permiso: 500 },
  ],
 },
 { name: 'ENVIO MASIVO', path: '/envio_masivo_viajes', permiso: 500 },
];
export const pages = [
 { name: 'CONTROL DE MANIOBRAS', path: '/control_maniobras' },
 { name: 'CONTENEDORES', path: '/cartas-porte' },
 { name: 'INVENTARIO', path: '/inventario_contenedores' },
 {
  name: 'NOMINAS',
  subpages: [
   { name: 'Nominas', path: '/nominas_viejas' },
   { name: 'Nominas Nueva (No entrar)', path: '/nominas' },
   { name: 'Precios', path: '/precios' },
  ],
 },
 { name: 'Terminales', path: '/terminales' },
 {
  name: 'Reportes',
  subpages: [
   { name: 'CUMPLIMIENTO ESTATUS POR HORA', path: '/cumplimiento_estatus_ejecutivos_maniobras' },
   { name: 'CUMPLIMIENTO ESTATUS POR ESTATUS', path: '/cumplimiento_estatus_maniobras' }
  ],
 },
];
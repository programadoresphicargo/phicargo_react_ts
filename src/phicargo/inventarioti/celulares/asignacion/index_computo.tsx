import { InventarioProvider } from '../../contexto/contexto';
import AsignacionesEquipoComputo from './asignaciones_equipo_computo';

const AsignacionActivos = () => {

  return (
    <>
      <InventarioProvider>
        <AsignacionesEquipoComputo></AsignacionesEquipoComputo>
      </InventarioProvider >
    </>
  );
};

export default AsignacionActivos;


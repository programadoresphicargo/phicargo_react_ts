
import { InventarioProvider } from '../../contexto/contexto';
import Asignaciones from './asignaciones_celular';

const AsignacionActivos = () => {

  return (
    <>
      <InventarioProvider>
        <Asignaciones></Asignaciones>
      </InventarioProvider >
    </>
  );
};

export default AsignacionActivos;


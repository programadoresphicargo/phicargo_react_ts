import { TravelsModal } from '../components/TravelsModal';
import { useNavigate } from 'react-router-dom';
import { useTravelQueries } from '../hooks/useTravelQueries';

const TravelsNearToBranch = () => {
  const navigate = useNavigate();

  const { travelsNearQuery } = useTravelQueries();

  return (
    <TravelsModal
      title="Viajes Bajando"
      message="Unidades que están realizando viaje en estado de retorno hacia su sucursal de origen"
      data={travelsNearQuery.data || []}
      isLoading={travelsNearQuery.isFetching}
      refetch={travelsNearQuery.refetch}
      onClose={() => navigate('/turnos')}
    />
  );
};

export default TravelsNearToBranch;


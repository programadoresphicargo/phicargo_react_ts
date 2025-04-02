import { TravelsModal } from '../components/TravelsModal';
import { useNavigate } from 'react-router-dom';
import { useTravelQueries } from '../hooks/useTravelQueries';

const TravelsUnloading = () => {
  const navigate = useNavigate();

  const { travelsUnloadingQuery } = useTravelQueries();

  return (
    <TravelsModal
      title="Viajes Descargando"
      message="Unidades que están realizando viaje en estado descargando"
      data={travelsUnloadingQuery.data || []}
      isLoading={travelsUnloadingQuery.isFetching}
      refetch={travelsUnloadingQuery.refetch}
      onClose={() => navigate('/turnos')}
    />
  );
};

export default TravelsUnloading;


import { TravelsModal } from '../components/TravelsModal';
import { useNavigate } from 'react-router-dom';
import { useTravelQueries } from '../hooks/useTravelQueries';

const TravelsInPlant = () => {
  const navigate = useNavigate();

  const { travelsInPlantQuery } = useTravelQueries();

  return (
    <TravelsModal
      title="Viajes en Planta"
      message="Viajes en planta"
      data={travelsInPlantQuery.data || []}
      isLoading={travelsInPlantQuery.isFetching}
      refetch={travelsInPlantQuery.refetch}
      onClose={() => navigate('/turnos')}
    />
  );
};

export default TravelsInPlant;

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useDriverQueries } from '../hooks/useDriverQueries';
import { useMemo } from 'react';

// import { useVehicleQueries } from '../hooks/useVehicleQueries';

interface Props {
  onClose: () => void;
  driverId: number;
}

// const initialState: DriverEdit = {
//   available: true,
//   reason: '',
//   vehicleId: 0,
// }

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const EditModal = ({ onClose, driverId }: Props) => {
  // const { control, handleSubmit } = useForm<DriverEdit>({
  //   defaultValues: initialState,
  // });

  const { drivers } = useDriverQueries();
  // const { 
  //   vehiclesReadQuery: { isFetching },
  //   vehiclesOptions 
  // } = useVehicleQueries();

  const driver = useMemo(
    () => drivers.find((d) => d.id === driverId),
    [drivers, driverId]
  );

  const onSubmit = () => {
    console.log('data');
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack spacing={2}>
          {/* Encabezado con botón de cierre */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography id="modal-modal-title" variant="h5" fontWeight="bold">
              Editar Operador
            </Typography>
            <Button onClick={onClose} size="small" color="error">
              X
            </Button>
          </Box>

          {/* Detalles del operador */}
          {driver && (
            <Box
              bgcolor="grey.100"
              borderRadius={1}
              p={2}
              display="flex"
              flexDirection="column"
              gap={1}
            >
              <Typography variant="subtitle1">
                <strong>Nombre:</strong> {driver.name}
              </Typography>
              <Typography variant="subtitle2">
                <strong>Puesto:</strong> {driver.job || 'No especificado'}
              </Typography>
              <Typography variant="subtitle2">
                <strong>Estatus:</strong> {driver.status?.toUpperCase() || 'No especificado'}
              </Typography>
            </Box>
          )}

          {/* Formulario */}
          <form onSubmit={onSubmit} noValidate>
            <Stack spacing={2}>
              {/* <AutocompleteElement
                control={control}
                name="vehicleId"
                label="Vehículo"
                loading={isFetching}
                options={vehiclesOptions}
              /> */}

              {/* <TextFieldElement
                control={control}
                name="reason"
                label="Motivo"
                fullWidth
                rules={{ required: 'Motivo requerido' }}
              />

              <CheckboxElement control={control} name="available" label="Disponible" /> */}

              <Button type="submit" variant="contained" color="primary" fullWidth>
                Guardar
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditModal;

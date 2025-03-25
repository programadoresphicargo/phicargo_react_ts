import { Box, Card, Step, StepLabel, Stepper, Typography } from '@mui/material';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { BasicInfoForm } from './BasicInfoForm';
import { Button } from '@/components/ui';
import { ExtraInfoForm } from './ExtraInfoForm';
import { ExtraServicesForm } from './ExtraServicesForm';
import { GoodsTable } from './goods/GoodsTable';
import { LinesTable } from './lines/LinesTable';
import { ServiceDetailsForm } from './ServiceDetailsForm';
import { SubmitHandler } from 'react-hook-form';
import { WaybillCreate } from '../models';
import { useCreateServiceContext } from '../hooks/useCreateServiceContext';
import { useCreateServiceMutation } from '../hooks/queries';
import { useNavigate } from 'react-router-dom';

export const CreateServiceView = () => {

  const navigate = useNavigate();

  const { activeStep, steps, handleBack, handleNext, form } =
    useCreateServiceContext();

  const { handleSubmit } = form;

  const { createServiceMutation } = useCreateServiceMutation();

  const onSubmit: SubmitHandler<WaybillCreate> = (data) => {
    

    createServiceMutation.mutate(data, {
      onSuccess: () => {
        navigate('/solicitudes-servicio/solicitudes');
      }
    });
  };

  return (
    <>
      <Card
        elevation={1}
        sx={{
          borderRadius: 4,
          padding: '2',
          boxShadow: 2,
          p: 2
        }}
      >
        <Stepper activeStep={activeStep}>
          {steps.map((label) => {
            const stepProps: { completed?: boolean } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            variant="contained"
            disabled={activeStep === 0}
            onClick={handleBack}
            size="small"
            sx={{ ml: 1 }}
            startIcon={<ArrowBackIosIcon />}
          >
            Atras
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={
              activeStep === steps.length - 1
                ? handleSubmit(onSubmit)
                : handleNext
            }
            endIcon={<ArrowForwardIosIcon />}
            disabled={createServiceMutation.isPending}
          >
            {activeStep === steps.length - 1 ? 'Crear' : 'Siguiente'}
          </Button>
        </Box>
      </Card>

      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed</Typography>
        </>
      ) : (
        <div className="mt-4">
          {activeStep === 0 && <BasicInfoForm form={form} />}
          {activeStep === 1 && <ServiceDetailsForm form={form} />}
          {activeStep === 2 && <ExtraInfoForm form={form} />}
          {activeStep === 3 && <LinesTable form={form} />}
          {activeStep === 4 && <GoodsTable form={form} />}
          {activeStep === 5 && <ExtraServicesForm form={form} />}
        </div>
      )}
    </>
  );
};


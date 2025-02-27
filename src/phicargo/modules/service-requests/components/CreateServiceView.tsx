import { Box, Card, Step, StepLabel, Stepper, Typography } from '@mui/material';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { BasicInfoForm } from './BasicInfoForm';
import { Button } from '@/components/ui/Button';
import { ExtraInfoForm } from './ExtraInfoForm';
import { ExtraServicesForm } from './ExtraServicesForm';
import { GoodsTable } from './goods/GoodsTable';
import { LinesTable } from './lines/LinesTable';
import { ServiceDetailsForm } from './ServiceDetailsForm';
import { useCreateServiceContext } from '../hooks/useCreateServiceContext';

export const CreateServiceView = () => {
  const { activeStep, steps, handleBack, handleNext, handleReset } =
    useCreateServiceContext();

  return (
    <>
      <Card elevation={1} className="rounded-lg px-2 py-5 shadow-md">
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
            onClick={handleNext}
            endIcon={<ArrowForwardIosIcon />}
          >
            {activeStep === steps.length - 1 ? 'Crear' : 'Siguiente'}
          </Button>
        </Box>
      </Card>

      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <div className="mt-4">
          {activeStep === 0 && <BasicInfoForm />}
          {activeStep === 1 && <ServiceDetailsForm />}
          {activeStep === 2 && <ExtraInfoForm />}
          {activeStep === 3 && <LinesTable />}
          {activeStep === 4 && <GoodsTable />}
          {activeStep === 5 && <ExtraServicesForm />}
        </div>
      )}
    </>
  );
};


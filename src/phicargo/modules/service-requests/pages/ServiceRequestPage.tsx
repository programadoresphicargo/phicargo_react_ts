import { ServiceRequestForm } from '../components/ServiceRequestForm';
import { ServiceRequestFormProvider } from '../context/ServiceRequestFormContext/ServiceRequestFormProvider';

const ServiceRequestPage = () => {
  return (
    <div className="p-2">
      <ServiceRequestFormProvider>
        <ServiceRequestForm />
      </ServiceRequestFormProvider>
    </div>
  );
};

export default ServiceRequestPage;


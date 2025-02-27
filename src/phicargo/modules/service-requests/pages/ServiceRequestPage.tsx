import { ServiceRequestForm } from '../components/ServiceRequestForm';
import { ServiceRequestFormProvider } from '../context/ServiceRequestFormContext/ServiceRequestFormProvider';

const ServiceRequestPage = () => {
  return (
    <section className="p-4">
      <ServiceRequestFormProvider>
        <ServiceRequestForm />
      </ServiceRequestFormProvider>
    </section>
  );
};

export default ServiceRequestPage;


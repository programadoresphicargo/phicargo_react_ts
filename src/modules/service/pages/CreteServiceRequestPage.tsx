import { CreateServiceProvider } from '../context/CreateServiceContext/CreateServiceContext';
import { CreateServiceView } from '../components/CreateServiceView';

const CreteServiceRequestPage = () => {
  return (
    <section className="p-4 bg-gray-200 h-[calc(100vh-3.3rem)]">
      <CreateServiceProvider>
        <CreateServiceView />
      </CreateServiceProvider>
    </section>
  );
};

export default CreteServiceRequestPage;


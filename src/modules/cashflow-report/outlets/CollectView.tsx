import CollectionTable from '../components/tables/CollectionTable';
import { Outlet } from 'react-router-dom';

const CollectView = () => {
  return (
    <>
      <CollectionTable />
      <Outlet />
    </>
  );
};

export default CollectView;


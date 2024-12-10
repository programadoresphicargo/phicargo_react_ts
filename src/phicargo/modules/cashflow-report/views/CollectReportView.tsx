import CollectionTable from '../components/tables/CollectionTable';
import Header from '../components/Header';
import NewCollectForm from '../components/NewCollectForm';
import { useState } from 'react';

const CollectReportView = () => {
  const [newRegister, setNewRegister] = useState(false);

  return (
    <>
      <Header />

      <div
        style={{
          paddingTop: '10px',
        }}
      >
        <CollectionTable  />
      </div>

      {newRegister && (
        <NewCollectForm handleClose={() => setNewRegister(false)} />
      )}
    </>
  );
};

export default CollectReportView;

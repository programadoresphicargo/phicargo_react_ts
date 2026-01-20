import { HeaderBase } from '@/components/ui';
import { IndicatorCard } from '@/components/utils/IndicatorCard';
import { useGetComplaintsQuery } from '../../hooks/queries';
import { useMemo } from 'react';

const Header = () => {
  const {
    getComplaintsQuery: { data },
  } = useGetComplaintsQuery();

  const openComplaints = useMemo(
    () => data?.filter((complaint) => complaint.status === 'open').length || 0,
    [data],
  );

  const closedComplaints = useMemo(
    () => data?.filter((complaint) => complaint.status === 'resolved').length || 0,
    [data],
  );

  const inProgressComplaints = useMemo(
    () => data?.filter((complaint) => complaint.status === 'in_process').length || 0,
    [data],
  );

  return (
    <HeaderBase backRoute="/menu">
      <div className="mx-8">
        <h1 className="m-0 p-0 text-xl text-gray-100 font-bold">
          No Conformidades
        </h1>
      </div>

      <div className="flex gap-2 flex-1">
        <IndicatorCard title="Abiertas" content={openComplaints} isLoading={false} />
        <IndicatorCard title="Cerradas" content={closedComplaints} isLoading={false} />
        <IndicatorCard title="En Proceso" content={inProgressComplaints} isLoading={false} />
      </div>
    </HeaderBase>
  );
};

export default Header;


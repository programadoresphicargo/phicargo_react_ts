import { Alert, LoadingSpinner } from '@/components/ui';
import { Card, CardBody } from '@heroui/react';
import type {
  MaintenanceRecord,
  RecordComment,
  RecordUpdateComment,
} from '../models';

import { CommentsTimeline } from './CommentsTimeline';
import { UpdateCommentsTimeline } from './UpdateCommentsTimeline';
import { useGetComments } from '../hooks';

interface Props {
  record: MaintenanceRecord;
  type: 'advance' | 'update';
}

export const RecordComments = ({ record, type }: Props) => {
  const {
    commentsQuery: {
      data: advanceComments,
      isLoading: isLoadingAdvanceComments,
    },
    updateCommentsQuery: {
      data: updateComments,
      isLoading: isLoadingUpdateComments,
    },
  } = useGetComments(record.id);

  const isLoadingAll = isLoadingAdvanceComments || isLoadingUpdateComments;
  const comments = type === 'advance' ? advanceComments : updateComments;

  const renderNoCommentsMessage = () => (
    <Alert
      color="primary"
      title={
        type === 'advance'
          ? 'No hay comentarios de avance'
          : 'No hay comentarios de actualización'
      }
    />
  );

  if (isLoadingAll) {
    return (
      <Card
        classNames={{
          base: 'shadow-none',
          header: 'bg-gray-100 px-4 py-1',
          body: 'overflow-y-auto h-72',
        }}
        radius="md"
      >
        <CardBody>
          <LoadingSpinner />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      classNames={{
        base: 'shadow-none',
        header: 'bg-gray-100 px-4 py-1',
        body: 'overflow-y-auto h-72',
      }}
      radius="md"
    >
      <CardBody>
        {comments && comments.length > 0 ? (
          type === 'advance' ? (
            <CommentsTimeline comments={comments as RecordComment[]} />
          ) : (
            <UpdateCommentsTimeline
              comments={comments as RecordUpdateComment[]}
            />
          )
        ) : (
          renderNoCommentsMessage()
        )}
      </CardBody>
    </Card>
  );
};


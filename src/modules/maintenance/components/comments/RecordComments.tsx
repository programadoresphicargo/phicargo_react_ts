import {
  Alert,
  LoadingSpinner,
  RefreshButton,
} from '@/components/ui';

import { Card, CardBody } from '@heroui/react';

import {
  MaintenanceRecord,
  RecordComment,
  RecordUpdateComment,
} from '../../models';

import { CommentsTimeline } from './CommentsTimeline';
import { UpdateCommentsTimeline } from './UpdateCommentsTimeline';
import { useGetComments } from '../../hooks';

interface Props {
  record: MaintenanceRecord;
  type: 'advance' | 'update';
}

export const RecordComments = ({
  record,
  type,
}: Props) => {
  const {
    commentsQuery: {
      data: advanceComments,
      isLoading: isLoadingAdvanceComments,
      refetch: refresh_comments,
    },
    updateCommentsQuery: {
      data: updateComments,
      isLoading: isLoadingUpdateComments,
      isFetching,
      refetch,
    },
  } = useGetComments(record.id);

  const isLoadingAll =
    isLoadingAdvanceComments ||
    isLoadingUpdateComments;

  const comments =
    type === 'advance'
      ? advanceComments
      : updateComments;

  const handleRefresh = () => {
    refetch();
    refresh_comments();
  };

  const renderNoCommentsMessage = () => (
    <div className="flex h-56 items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
          <i
            className={`bi ${type === 'advance'
              ? 'bi-chat-left-text'
              : 'bi-arrow-repeat'
              } text-lg text-slate-400`}
          />
        </div>

        <p className="text-xs font-semibold text-slate-600">
          {type === 'advance'
            ? 'No hay comentarios de avance'
            : 'No hay comentarios de actualización'}
        </p>

        <p className="mt-1 text-[11px] text-slate-400">
          Los registros aparecerán aquí conforme se agreguen.
        </p>
      </div>
    </div>
  );

  if (isLoadingAll) {
    return (
      <Card
        radius="lg"
        className="border border-slate-200 bg-slate-50 shadow-none"
      >
        <CardBody className="flex h-72 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner />

            <span className="text-xs text-slate-400">
              Cargando historial...
            </span>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      radius="lg"
      className="border border-slate-200 bg-slate-50 shadow-none"
    >
      {/* TOOLBAR */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
            <i
              className={`bi ${type === 'advance'
                ? 'bi-chat-left-text'
                : 'bi-arrow-repeat'
                } text-xs text-slate-600`}
            />
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-700">
              {type === 'advance'
                ? 'Comentarios de avance'
                : 'Actualizaciones'}
            </p>

            <p className="text-[10px] text-slate-400">
              {comments?.length || 0}{' '}
              {comments?.length === 1
                ? 'registro'
                : 'registros'}
            </p>
          </div>
        </div>

        <RefreshButton
          onRefresh={handleRefresh}
          isLoading={isFetching}
        />
      </div>

      {/* TIMELINE */}
      <CardBody className="h-72 overflow-y-auto p-4">
        {comments && comments.length > 0 ? (
          type === 'advance' ? (
            <CommentsTimeline
              comments={comments as RecordComment[]}
            />
          ) : (
            <UpdateCommentsTimeline
              comments={
                comments as RecordUpdateComment[]
              }
            />
          )
        ) : (
          renderNoCommentsMessage()
        )}
      </CardBody>
    </Card>
  );
};
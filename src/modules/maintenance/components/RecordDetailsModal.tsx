import { AddButton } from '@/components/ui';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Tab, Tabs, Button } from '@heroui/react';

import CheckIcon from '@mui/icons-material/Check';
import CompleteDialog from '../components/CompleteDialog';
import type { MaintenanceRecord } from '../models';
import { MuiModal } from '@/components';
import { RecordComments } from './comments/RecordComments';
import { RecordInfo } from './RecordInfo';
import { TextareaInput } from '@/components/inputs';
import { useMaintenanceRecord } from '../hooks';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import odooApi from '@/api/odoo-api';
import { VehicleHistory } from './history/history';
import BlockVehicleDialog from './block-vehicle';

interface RegisterDetailForm {
  comment: string;
}

const initialFormValues: RegisterDetailForm = {
  comment: '',
};

interface Props {
  open: boolean;
  onClose: () => void;
  record: MaintenanceRecord;
}

export const RecordDetailsModal = ({
  open,
  onClose,
  record,
}: Props) => {
  const [completeModal, setCompleteModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [action, setAction] = useState<string>('');
  const [openBlock, setOpenBlock] = useState(false);

  const {
    addRecordCommentMutation: {
      mutate: addComment,
      isPending,
    },
  } = useMaintenanceRecord();

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<RegisterDetailForm>({
    defaultValues: initialFormValues,
  });

  const onSubmit: SubmitHandler<RegisterDetailForm> = (
    data,
  ) => {
    if (!data.comment || data.comment.trim().length < 2) {
      return;
    }

    addComment(
      {
        id: record.id,
        comment: {
          comment: data.comment.trim(),
        },
      },
      {
        onSuccess: () => {
          reset(initialFormValues);
        },
      },
    );
  };

  const OpenChecklist = async (
    id_checklist: number | null,
  ): Promise<void> => {
    if (!id_checklist) return;

    const url = `${odooApi.defaults.baseURL}/tms_travel/checklist/export/${id_checklist}`;

    window.open(url, '_blank');
  };

  const handleBlock = () => {
    setAction('block');
    setOpenBlock(true);
  };

  const handleUnblock = () => {
    setAction('unblock');
    setOpenBlock(true);
  };

  const handleAptoParaUso = () => {
    setAction('unblock');
    setOpenBlock(true);
  };

  return (
    <>
      <MuiModal
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="xl"
        header={
          <div
            className="flex items-center gap-3"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#002887]/10">
              <i className="bi bi-tools text-lg text-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">
                  {record.vehicle.name}
                </h2>

                <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                  REPORTE #{record.id}
                </span>
              </div>

              <p className="mt-0.5 text-xs text-white">
                Detalle y seguimiento del reporte de mantenimiento
              </p>
            </div>
          </div>
        }
      >
        <div
          className="bg-[#f8fafc] px-5 py-5"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {/* =====================================================
              ACCIONES
          ====================================================== */}
          <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                <i className="bi bi-lightning-charge-fill text-sm text-slate-600" />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Acciones
                </p>

                <p className="text-[11px] text-slate-400">
                  Operaciones disponibles para este reporte.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {record.status === 'draft' && (
                <Button
                  color="success"
                  size="sm"
                  radius="md"
                  className="font-medium text-white"
                  onPress={() => setConfirmModal(true)}
                  startContent={
                    <i className="bi bi-check-circle-fill" />
                  }
                >
                  Confirmar
                </Button>
              )}

              {record.id_checklist && (
                <Button
                  color="primary"
                  radius="md"
                  size="sm"
                  className="font-medium text-white"
                  onPress={() =>
                    OpenChecklist(record.id_checklist)
                  }
                  startContent={
                    <i className="bi bi-file-pdf" />
                  }
                >
                  Checklist equipo
                </Button>
              )}

              {record.vehicle.state_id !== 10 &&
                record.status === 'draft' && (
                  <Button
                    color="danger"
                    radius="md"
                    size="sm"
                    className="font-medium text-white"
                    onPress={handleBlock}
                    startContent={
                      <i className="bi bi-lock" />
                    }
                  >
                    Bloquear
                  </Button>
                )}

              {record.vehicle.state_id === 10 &&
                record.status === 'draft' && (
                  <Button
                    color="success"
                    radius="md"
                    size="sm"
                    className="font-medium text-white"
                    onPress={handleUnblock}
                    startContent={
                      <i className="bi bi-unlock" />
                    }
                  >
                    Desbloquear
                  </Button>
                )}

              {record.vehicle.state_id === 1 && (
                <Button
                  color="success"
                  radius="md"
                  className="font-medium text-white"
                  size="sm"
                  onPress={handleAptoParaUso}
                  startContent={
                    <i className="bi bi-check-lg" />
                  }
                >
                  Apto para uso
                </Button>
              )}
            </div>
          </div>

          {/* =====================================================
              INFORMACIÓN + COMENTARIO
          ====================================================== */}
          <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            {/* INFORMACIÓN */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <i className="bi bi-info-circle-fill text-sm text-[#002887]" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Información del reporte
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Datos generales de la incidencia.
                  </p>
                </div>
              </div>

              <RecordInfo record={record} />
            </div>

            {/* COMENTARIO */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                  <i className="bi bi-chat-left-text-fill text-sm text-emerald-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Seguimiento
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Registra un comentario de avance.
                  </p>
                </div>
              </div>

              <TextareaInput
                control={control}
                name="comment"
                label="Comentario de avance"
                isUpperCase
              />

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <AddButton
                  label="Agregar avance"
                  className="w-full"
                  color="primary"
                  size="small"
                  loading={isPending}
                  onClick={handleSubmit(onSubmit)}
                />

                <Button
                  color="primary"
                  radius="md"
                  size="sm"
                  className="w-full font-medium text-white"
                  startContent={<CheckIcon />}
                  onPress={() =>
                    setCompleteModal(true)
                  }
                >
                  Actualizar estado
                </Button>
              </div>
            </div>
          </div>

          {/* =====================================================
              HISTORIAL
          ====================================================== */}
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 pt-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <i className="bi bi-clock-history text-sm text-slate-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Historial del reporte
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Consulta los avances y movimientos registrados.
                  </p>
                </div>
              </div>

              <Tabs
                aria-label="Secciones del reporte"
                variant="underlined"
                color="primary"
                size="sm"
                fullWidth
                classNames={{
                  tabList: 'gap-6',
                  tab: 'px-1',
                  tabContent:
                    'text-xs font-semibold',
                  cursor: 'bg-[#002887]',
                  panel: 'px-0 py-4',
                }}
              >
                <Tab
                  key="advance-comments"
                  title={
                    <div className="flex items-center gap-2">
                      <i className="bi bi-chat-left-text" />
                      <span>Avance</span>
                    </div>
                  }
                >
                  <RecordComments
                    record={record}
                    type="advance"
                  />
                </Tab>

                <Tab
                  key="update-comments"
                  title={
                    <div className="flex items-center gap-2">
                      <i className="bi bi-arrow-repeat" />
                      <span>Actualización</span>
                    </div>
                  }
                >
                  <RecordComments
                    record={record}
                    type="update"
                  />
                </Tab>

                <Tab
                  key="vehicle-history"
                  title={
                    <div className="flex items-center gap-2">
                      <i className="bi bi-clock-history" />
                      <span>Historial de usos</span>
                    </div>
                  }
                >
                  <VehicleHistory record={record} />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </MuiModal>

      {/* =========================================================
          MODALES
      ========================================================== */}

      <CompleteDialog
        open={completeModal}
        onClose={() => setCompleteModal(false)}
        itemId={record.id}
      />

      <ConfirmDialog
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        itemId={record.id}
      />

      <BlockVehicleDialog
        open={openBlock}
        onClose={() => setOpenBlock(false)}
        onCloseDialog={onClose}
        record={record}
        action={action}
      />
    </>
  );
};
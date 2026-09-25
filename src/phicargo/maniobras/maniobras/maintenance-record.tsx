import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  Avatar,
  Card,
  CardBody,
  Spinner,
} from '@heroui/react';
import odooApi from '@/api/odoo-api';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import Icon from '@/assets/menu/maintenanceIcon.png';

type MaintenanceRecordComment = {
  comment_text: string;
  by_user: any;
  comment_date: string;
};

type MaintenanceRecord = {
  id: number;
  vehicle: string;
  supervisor: string;
  comments: MaintenanceRecordComment[];
  check_in: string;
};

interface Props {
  vehicle_ids: number[];
}

export default function MaintenanceRecordsVehicles({
  vehicle_ids,
}: Props) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [data, setData] = React.useState<MaintenanceRecord[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);

  const [expandedKeys, setExpandedKeys] =
    React.useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      if (vehicle_ids.length === 0) {
        setData([]);
        setOpen(false);
        return;
      }

      setData([]);

      try {
        setLoading(true);

        const responses = await Promise.all(
          vehicle_ids.map((vehicleId) =>
            odooApi.get(
              `/maintenance-record/vehicle_id/${vehicleId}?statuses=draft&statuses=pending`,
            ),
          ),
        );

        if (cancelled) return;

        const nuevosDatos = responses.flatMap(
          (response) => response.data,
        );

        setData(nuevosDatos);

        setExpandedKeys(
          new Set(
            nuevosDatos.map((item: MaintenanceRecord) =>
              String(item.id),
            ),
          ),
        );

        setOpen(nuevosDatos.length > 0);
      } catch (error) {
        if (cancelled) return;

        console.error(
          'Error al cargar datos:',
          error,
        );

        setData([]);
        setOpen(false);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [vehicle_ids]);

  return (
    <Box
      sx={{
        width: open ? 500 : 0,
        flexShrink: 0,
        height: '100%',
        borderLeft: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
        zIndex: 99999,
        transition: 'width 300ms ease',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div className="flex h-full flex-col">

        {/* Header */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <i className="bi bi-tools text-lg text-red-600" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-800">
                Reportes de mantenimiento
              </h2>

              <p className="text-xs text-slate-500">
                Incidencias pendientes de atención
              </p>
            </div>

            {data.length > 0 && (
              <div className="ml-auto shrink-0 rounded-full bg-red-50 px-2.5 py-1">
                <span className="text-[11px] font-semibold text-red-700">
                  {data.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">

          {isLoading && (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <Spinner size="sm" />

              <span className="text-xs text-slate-500">
                Cargando reportes...
              </span>
            </div>
          )}

          {!isLoading && data.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <i className="bi bi-check2-circle text-xl text-slate-400" />
              </div>

              <p className="text-sm font-medium text-slate-700">
                Sin reportes pendientes
              </p>

              <p className="mt-1 max-w-xs text-xs text-slate-500">
                No existen reportes de mantenimiento pendientes
                para las unidades seleccionadas.
              </p>
            </div>
          )}

          {!isLoading && data.length > 0 && (
            <Accordion
              variant="splitted"
              selectedKeys={expandedKeys}
              onSelectionChange={(keys) => {
                setExpandedKeys(keys as Set<string>);
              }}
              className="px-0"
            >
              {data.map((item: MaintenanceRecord) => (
                <AccordionItem
                  key={String(item.id)}
                  title={
                    <span className="text-sm font-semibold text-slate-800">
                      {item.vehicle}
                    </span>
                  }
                  subtitle={
                    <span className="text-xs text-slate-500">
                      Reportado: {item.check_in}
                    </span>
                  }
                  startContent={
                    <Avatar
                      isBordered
                      color="danger"
                      radius="lg"
                      src={Icon}
                      className="h-9 w-9"
                    />
                  }
                  classNames={{
                    base: 'bg-white border border-slate-200 shadow-sm',
                    title: 'font-semibold',
                    subtitle: 'text-xs',
                    content: 'pt-1',
                  }}
                >
                  <div className="space-y-3 pb-2">
                    {item.comments.map(
                      (
                        comment: MaintenanceRecordComment,
                        index,
                      ) => (
                        <Card
                          key={`${item.id}-${index}`}
                          radius="lg"
                          className="border border-slate-200 bg-white shadow-none"
                        >
                          <CardBody className="p-4">
                            {/* Usuario */}
                            <div className="flex items-center gap-3">
                              <Avatar
                                isBordered
                                radius="full"
                                size="sm"
                                color="primary"
                              />

                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-slate-700">
                                  {comment.by_user?.nombre}
                                </p>

                                <p className="truncate text-[11px] text-slate-400">
                                  {comment.by_user?.usuario}
                                </p>
                              </div>

                              <span className="ml-auto shrink-0 text-[10px] text-slate-400">
                                {comment.comment_date}
                              </span>
                            </div>

                            {/* Comentario */}
                            <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5">
                              <p className="text-xs leading-5 text-slate-600">
                                {comment.comment_text}
                              </p>
                            </div>
                          </CardBody>
                        </Card>
                      ),
                    )}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </Box>
  );
}
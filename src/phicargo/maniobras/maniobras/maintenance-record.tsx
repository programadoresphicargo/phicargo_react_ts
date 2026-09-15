import * as React from 'react';
import { Accordion, AccordionItem, Avatar, Card, CardBody, CardFooter, CardHeader, Spinner } from '@heroui/react';
import odooApi from '@/api/odoo-api';
import { useEffect } from 'react';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import Icon from '@/assets/menu/maintenanceIcon.png';

type MaintenanceRecordComment = {
  comment_text: string;
  by_user: any;
  comment_date: string;
}

type MaintenanceRecord = {
  id: number;
  vehicle: string;
  supervisor: string;
  comments: MaintenanceRecordComment[];
  check_in: string;
}

interface Props {
  vehicle_ids: number[];
}

export default function MaintenanceRecordsVehicles({ vehicle_ids }: Props) {

  const [open, setOpen] = React.useState<boolean>(false);
  const [data, setData] = React.useState<MaintenanceRecord[]>([]);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = React.useState<Set<string>>(
    new Set()
  );

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
              `/maintenance-record/vehicle_id/${vehicleId}?statuses=draft&statuses=pending`
            )
          )
        );

        if (cancelled) return;

        const nuevosDatos = responses.flatMap(
          (response) => response.data
        );

        setData(nuevosDatos);

        setExpandedKeys(
          new Set(
            nuevosDatos.map((item: MaintenanceRecord) => String(item.id))
          )
        );

        setOpen(nuevosDatos.length > 0);
        setLoading(false);
      } catch (error) {
        if (cancelled) return;

        console.error('Error al cargar datos:', error);
        setData([]);
        setOpen(false);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [vehicle_ids, setOpen]);

  return (
    <div>
      <React.Fragment key={"right"}>
        <Box
          sx={{
            width: open ? 500 : 0,
            flexShrink: 0,
            height: '100%',
            borderLeft: '1px solid #ddd',
            backgroundColor: 'white',
            overflow: 'auto',
            zIndex: 99999,
            transition: 'width 300ms ease',
          }}
        >
          <AppBar elevation={2}
            position="static"
            sx={{
              background: 'linear-gradient(90deg, #7f1d1d, #dc2626)',
              padding: '0 16px'
            }}>
            <Toolbar>
              <Typography sx={{ fontFamily: 'Inter' }}>
                Reportes de mantenimiento
              </Typography>
            </Toolbar>
          </AppBar>
          <div className='mt-3'>
            {isLoading && (
              <div className="h-64 flex items-center justify-center">
                <Spinner />
              </div>
            )}
            <Accordion
              variant="splitted"
              selectedKeys={expandedKeys}
              onSelectionChange={(keys) => {
                setExpandedKeys(keys as Set<string>);
              }}>
              {data.map((item: MaintenanceRecord) =>
                <AccordionItem
                  key={String(item.id)}
                  title={item.vehicle}
                  subtitle={item.check_in}
                  startContent={
                    <Avatar
                      isBordered
                      color="danger"
                      radius="lg"
                      src={Icon}
                    />
                  }
                >
                  {item.comments.map((comment: MaintenanceRecordComment) => (
                    <Card className='mt-2'>
                      <CardHeader className="justify-between">
                        <div className="flex gap-5">
                          <Avatar
                            isBordered
                            radius="full"
                            size="md"
                            color="primary"
                          />
                          <div className="flex flex-col gap-1 items-start justify-center">
                            <h4 className="text-small font-semibold leading-none text-default-600">{comment.by_user.nombre}</h4>
                            <h5 className="text-small tracking-tight text-default-400">{comment.by_user.usuario}</h5>
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody className="px-3 py-0 text-small text-default-400">
                        <p>{comment.comment_text}</p>
                      </CardBody>
                      <CardFooter className="gap-3">
                        <div className="flex gap-1">
                          <p className="font-semibold text-default-400 text-small">{comment.comment_date}</p>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </Box>
      </React.Fragment>
    </div >
  );
} 
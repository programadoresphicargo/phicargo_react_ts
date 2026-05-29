import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Typography from '@mui/material/Typography';
import { Card, CardBody, CardHeader, Divider } from '@heroui/react';

export type Historial = {
    id: number,
    fecha_movimiento: string,
    observaciones: string,
    nombre: string,
    tipo_movimiento: string,
    cantidad: number,
}

export default function HistorialStock({ data }: { data: Historial[] }) {

    const getIcon = (tipo: string) => {
        switch (tipo) {
            case 'alta':
                return <AccessTimeIcon />;
            case 'baja':
                return <AccessTimeIcon />;
            case 'ajuste':
                return <AccessTimeIcon />;
            default:
                return <AccessTimeIcon />;
        }
    };

    return (
        <Card>
            <CardHeader>
                Historial de stock
            </CardHeader>
            <Divider></Divider>
            <CardBody>
                <Timeline>
                    {data.map((item, index) => (
                        <TimelineItem key={item.id || index}>
                            <TimelineOppositeContent
                                sx={{ m: 'auto 0' }}
                                align="right"
                                variant="body2"
                                color="text.secondary"
                            >
                                {new Date(item.fecha_movimiento).toLocaleString()}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot color={item.tipo_movimiento === 'baja' ? 'error' : 'primary'}>
                                    {getIcon(item.tipo_movimiento)}
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                Usuario: {item.nombre} Movimiento: {item.tipo_movimiento.toUpperCase()}
                                <Typography>
                                    Cantidad: {item.cantidad}
                                    {item.observaciones && ` — ${item.observaciones}`}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </CardBody>
        </Card>
    );
}

import { Card, CardBody, CardHeader } from "@heroui/react";
import { Divider } from "@heroui/react";
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { UseFormWatch } from "react-hook-form";
import { FolioCostoExtra } from "../folios/tabla";
import Typography from "@mui/material/Typography";

type Props = {
    watch: UseFormWatch<FolioCostoExtra>;
};

const TimeLineCE = ({ watch }: Props) => {

    const fecha_creacion = watch("fecha_creacion");
    const usuario_creacion = watch("usuario_creacion");
    const fecha_confirmacion = watch("fecha_confirmacion");
    const fecha_facturacion = watch("fecha_facturacion");
    const usuario_cancelacion = watch("usuario_cancelacion");
    const motivo_cancelacion = watch("motivo_cancelacion");
    const fecha_cancelacion = watch("fecha_cancelacion");
    const usuario_facturo = watch("usuario_facturo");
    const comentarios_cancelacion = watch("comentarios_cancelacion");
    const usuario_confirmacion = watch("usuario_confirmacion");

    return (
        <>
            <Card>
                <CardHeader>
                    TimeLine
                </CardHeader>
                <Divider></Divider>
                <CardBody>
                    <Timeline>
                        <TimelineItem>
                            <TimelineOppositeContent
                                sx={{ m: 'auto 0' }}
                                align="right"
                                variant="body1"
                                color="text.secondary"
                            >
                                {fecha_creacion}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot color="primary">
                                    <AccessTimeIcon></AccessTimeIcon>
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography component="span">
                                    Folio creado
                                </Typography>
                                <Typography>{usuario_creacion}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineOppositeContent
                                sx={{ m: 'auto 0' }}
                                variant="body1"
                                color="text.secondary"
                            >
                                {fecha_confirmacion}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot color="primary">
                                    <AccessTimeIcon></AccessTimeIcon>
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography component="span">
                                    Confirmado
                                </Typography>
                                <Typography>{usuario_confirmacion}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineOppositeContent
                                sx={{ m: 'auto 0' }}
                                variant="body1"
                                color="text.secondary"
                            >
                                {fecha_facturacion}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot color="primary">
                                    <AccessTimeIcon></AccessTimeIcon>
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography component="span">
                                    Facturado
                                </Typography>
                                <Typography>{usuario_facturo}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineOppositeContent
                                sx={{ m: 'auto 0' }}
                                variant="body1"
                                color="text.secondary"
                            >
                                {fecha_cancelacion}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot color="primary">
                                    <AccessTimeIcon></AccessTimeIcon>
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography component="span">
                                    Cancelado
                                </Typography>
                                <Typography>{usuario_cancelacion}</Typography>
                                <Typography>{motivo_cancelacion}</Typography>
                                <Typography>{comentarios_cancelacion}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                    </Timeline>
                </CardBody>
            </Card>
        </>
    );
};

export default TimeLineCE;

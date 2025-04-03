import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Container, filledInputClasses } from '@mui/material';
import { Divider, Input, User } from "@heroui/react";
import React, { useCallback, useContext, useEffect, useState } from 'react';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Button } from "@heroui/react";
import CostosExtrasContenedores from './añadir_contenedor/maniobra_contenedores';
import { CostosExtrasContext } from '../context/context';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Dialog from '@mui/material/Dialog';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import Grid from '@mui/material/Grid';
import HotelIcon from '@mui/icons-material/Hotel';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import LinearProgress from '@mui/material/LinearProgress';
import ManiobraContenedores from './añadir_contenedor/maniobra_contenedores';
import RepeatIcon from '@mui/icons-material/Repeat';
import ServiciosAplicadosCE from './costos_aplicados/costos_aplicados';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import dayjs from 'dayjs';
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import { useAuthContext } from "@/modules/auth/hooks";

const TimeLineCE = ({ }) => {

    const { id_folio, formData, setFormData, DisabledForm } = useContext(CostosExtrasContext);

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
                                {formData.fecha_creacion}
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
                                <Typography>{formData.usuario_creacion}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineOppositeContent
                                sx={{ m: 'auto 0' }}
                                variant="body1"
                                color="text.secondary"
                            >
                                {formData.fecha_confirmacion}
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
                                <Typography>{formData.usuario_confirmacion}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineOppositeContent
                                sx={{ m: 'auto 0' }}
                                variant="body1"
                                color="text.secondary"
                            >
                                {formData.fecha_facturacion}
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
                                <Typography>{formData.usuario_facturo}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineOppositeContent
                                sx={{ m: 'auto 0' }}
                                variant="body1"
                                color="text.secondary"
                            >
                                {formData.fecha_cancelacion}
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
                                <Typography>{formData.usuario_cancelacion}</Typography>
                                <Typography>{formData.motivo_cancelacion}</Typography>
                                <Typography>{formData.comentarios_cancelacion}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                    </Timeline>
                </CardBody>
            </Card>
        </>
    );
};

export default TimeLineCE;

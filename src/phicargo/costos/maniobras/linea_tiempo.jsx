import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import ManiobraContenedores from './añadir_contenedor/maniobra_contenedores';
import { Divider, Input, User } from "@nextui-org/react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import { Button } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Container, filledInputClasses } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useAuthContext } from '@/phicargo/modules/auth/hooks';
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import odooApi from '@/phicargo/modules/core/api/odoo-api';
import CostosExtrasContenedores from './añadir_contenedor/maniobra_contenedores';
import { CostosExtrasContext } from '../context/context';
import ServiciosAplicadosCE from './costos_aplicados/costos_aplicados';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';

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
                                <Typography>{formData.usuario_cancelo}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                    </Timeline>
                </CardBody>
            </Card>
        </>
    );
};

export default TimeLineCE;

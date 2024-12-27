import Grid from '@mui/material/Grid';
import Entregas from "./Entregas";
import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import MonitoreoNavbar from './Navbar';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { Calendar } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";

export default function EntregaMonitoreo() {
    const fechaActual = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = React.useState(parseDate(fechaActual));

    return (
        <>
            <MonitoreoNavbar />
            <Grid container className='bg-soft-secondary' p={3}>
                <Grid item xs={4} md={3}>
                    <Calendar
                        value={selectedDate}
                        onChange={setSelectedDate} />
                </Grid>
                <Grid item xs={8} md={9}>
                    <Entregas
                        fecha={selectedDate}
                    />
                </Grid>
            </Grid>
        </>
    );
}
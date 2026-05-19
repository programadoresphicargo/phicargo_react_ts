import Grid from '@mui/material/Grid';
import Entregas from "./Entregas";
import React from 'react';
import { Calendar } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import CustomNavbar from '@/pages/CustomNavbar';
import { pages } from './pages';

export default function EntregaMonitoreo() {

    const fechaActual = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = React.useState(parseDate(fechaActual));

    return (
        <>
            <CustomNavbar pages={pages}></CustomNavbar>
            <Grid container className='bg-soft-secondary' p={3}>
                <Grid item xs={4} md={3}>
                    <Calendar
                        firstDayOfWeek="mon"
                        value={selectedDate}
                        onChange={setSelectedDate} />
                </Grid>
                <Grid item xs={8} md={9}>
                    <Entregas
                        fecha={selectedDate.toString()}
                    />
                </Grid>
            </Grid>
        </>
    );
}
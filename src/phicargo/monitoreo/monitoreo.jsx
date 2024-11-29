import Grid from '@mui/material/Grid';
import Entregas from "./Entregas";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import MonitoreoNavbar from './Navbar';

export default function EntregaMonitoreo() {
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const handleDateChange = (newValue) => {
        setSelectedDate(newValue);
        console.log('Fecha seleccionada:', newValue.format('YYYY-MM-DD'));
    };

    return (
        <>
            <MonitoreoNavbar />
            <Grid container className='bg-soft-secondary' p={3}>
                <Grid item xs={4} md={3}>
                    <Card>
                        <CardContent>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                />
                            </LocalizationProvider>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={8} md={9}>
                    <Entregas
                        fecha={selectedDate.format('YYYY-MM-DD')}
                    />
                </Grid>
            </Grid>
        </>
    );
}

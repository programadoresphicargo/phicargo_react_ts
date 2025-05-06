import { Avatar, Badge, Card, CardBody, CardHeader, Divider } from "@heroui/react";
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Spinner } from "@heroui/react";
import odooApi from '@/api/odoo-api';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from "@heroui/react";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

function AbrirPeriodo({ open, handleClose, datapago }) {

    const [isLoading, setLoading] = useState(false);
    const [dates, setDates] = useState([]);

    const handleDateChange = (newDates) => {
        setDates(newDates);
    };

    const abrirPeriodo = async () => {
        if (dates && dates.length === 2 && dates[0] && dates[1]) {
            const startDate = dayjs(dates[0]).format('YYYY-MM-DD');
            const endDate = dayjs(dates[1]).format('YYYY-MM-DD');
            try {
                setLoading(true);
                const response = await odooApi.post('/tms_travel/periodos_pagos_estadias_operadores/create/', {
                    date_start: startDate,
                    date_end: endDate
                });
                if (response.data.status === "success") {
                    toast.success(response.data.message);
                    handleClose();
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={open}
                onClose={handleClose}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '30px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.0)',
                    },
                }}
            >
                <DialogTitle>
                    {"Abrir nuevo periodo"}
                </DialogTitle>
                <DialogContent>

                    <RangePicker onChange={handleDateChange} dropdownClassName="custom-range-picker-popup" />
                    <Button color="success" className="text-white" onPress={() => abrirPeriodo()}>Abrir periodo</Button>

                </DialogContent>
            </Dialog >
        </>
    );
}

export default AbrirPeriodo;

import odooApi from "@/api/odoo-api";
import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, NumberInput, Input, DatePicker, Textarea, Progress, Checkbox
} from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import toast from 'react-hot-toast';
import { parseDate } from "@internationalized/date";
import BajaCelular from "../../celulares/baja_form";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import HistorialAsignaciones from "../../asignacion/historial";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import DispositivosSinAsignar from "./dispositivos";

export default function EmpleadosSinAsignarCelular({ isOpen, onOpenChange, tipo }) {

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="6xl" scrollBehavior="outside"
                isDismissable={false}
                isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader
                                className="flex flex-col gap-1"
                                style={{
                                    background: 'linear-gradient(90deg, #a10003, #002887)',
                                    color: 'white',
                                    borderTopLeftRadius: '12px', 
                                    borderTopRightRadius: '12px', 
                                }}
                            >
                                Dispositivos sin asignar
                            </ModalHeader>
                            <ModalBody className="m-0 p-0">
                                <Box sx={{ width: '100%' }}>
                                    <TabContext value={value}>
                                        <Box sx={{ borderColor: 'divider', background: 'linear-gradient(90deg, #a10003, #002887)', color: 'white' }}>
                                            <TabList
                                                onChange={handleChange}
                                                aria-label="lab API tabs example"
                                                textColor="inherit" sx={{
                                                    '& .MuiTabs-indicator': {
                                                        backgroundColor: 'white',
                                                        height: '3px',
                                                    }
                                                }}>
                                                <Tab label="Celulares" value="1" sx={{ fontFamily: 'Inter' }} />
                                                <Tab label="Computo" value="2" sx={{ fontFamily: 'Inter' }} />
                                            </TabList>
                                        </Box>
                                        <TabPanel value="1"><DispositivosSinAsignar tipo={"celular"}></DispositivosSinAsignar></TabPanel>
                                        <TabPanel value="2"><DispositivosSinAsignar tipo={"computo"}></DispositivosSinAsignar></TabPanel>
                                    </TabContext>
                                </Box>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onPress={onClose}>
                                    Cancelar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    );
}

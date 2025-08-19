import { Button, Chip } from '@heroui/react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { DatePicker } from 'antd';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import odooApi from '@/api/odoo-api';
import NavbarInventarioTI from '../../navbar';
import FormCelulares from './form';
import {
    useDisclosure,
} from "@heroui/react";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import EmpleadosTI from './tabla';
import CelularesTabla from './tabla';

const Celulares = () => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <NavbarInventarioTI></NavbarInventarioTI>
            <TabContext value={value}>
                <Box sx={{ borderColor: 'divider', background: 'linear-gradient(90deg, #a10003, #002887)', color: 'white' }}>
                    <TabList onChange={handleChange} textColor="inherit" sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'white',
                            height: '3px',
                        }
                    }}>
                        <Tab label="Activas" value="1" sx={{ fontFamily: 'Inter' }} />
                        <Tab label="Inactivas" value="2" sx={{ fontFamily: 'Inter' }} />
                    </TabList>
                </Box>
                <TabPanel value="1" sx={{ padding: 0, margin: 0 }}><CelularesTabla active={true}></CelularesTabla></TabPanel>
                <TabPanel value="2" sx={{ padding: 0, margin: 0 }}><CelularesTabla active={false}></CelularesTabla></TabPanel>
            </TabContext >
        </Box >
    );
};

export default Celulares;


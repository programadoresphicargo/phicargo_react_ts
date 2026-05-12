import React from 'react';
import Box from '@mui/material/Box';
import NavbarInventarioTI from '../../navbar';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CelularesTabla from './tabla';

const Celulares = () => {

    const [value, setValue] = React.useState('1');

    const handleChange = (
        _: React.SyntheticEvent,
        newValue: string
    ) => {
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
                        <Tab label="Activos" value="1" sx={{ fontFamily: 'Inter' }} />
                        <Tab label="Inactivos" value="2" sx={{ fontFamily: 'Inter' }} />
                    </TabList>
                </Box>
                <TabPanel value="1" sx={{ padding: 0, margin: 0 }}><CelularesTabla active={true}></CelularesTabla></TabPanel>
                <TabPanel value="2" sx={{ padding: 0, margin: 0 }}><CelularesTabla active={false}></CelularesTabla></TabPanel>
            </TabContext >
        </Box >
    );
};

export default Celulares;


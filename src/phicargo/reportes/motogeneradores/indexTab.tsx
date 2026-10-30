import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import PDVMaintenance from './pdv';
import CustomNavbar from '@/pages/CustomNavbar';
import ChecklistMotogeneradores from './checklist_equipos';

export default function IndexChecklistMotogeneradores() {
 const [value, setValue] = React.useState('1');

 const handleChange = (newValue: string) => {
  setValue(newValue);
 };

 return (
  <Box sx={{
   borderColor: 'divider',
   backgroundColor: '#002887',
   color: 'white',
  }}>
   <CustomNavbar></CustomNavbar>
   <TabContext value={value}>
    <TabList
     onChange={(_, newValue) => handleChange(newValue)}
     aria-label="lab tabs"
     textColor="inherit"
     sx={{
      '& .MuiTabs-indicator': {
       backgroundColor: 'white',
       height: '3px',
      },
      '& .MuiTab-root': {
       fontFamily: 'Inter',
      },
     }}
    >
     <Tab label="Viaje" value="1" />
     <Tab label="Maniobra" value="2" disabled />
     <Tab label="Checklist" value="3" />
    </TabList>
    <TabPanel value="1" tabIndex={0} sx={{ p: 0, m: 0 }}>
     <PDVMaintenance></PDVMaintenance>
    </TabPanel>
    <TabPanel value="2" tabIndex={0} sx={{ p: 0, m: 0 }}>
     <PDVMaintenance></PDVMaintenance>
    </TabPanel>
    <TabPanel value="3" tabIndex={0} sx={{ p: 0, m: 0 }}>
     <ChecklistMotogeneradores></ChecklistMotogeneradores>
    </TabPanel>
   </TabContext>
  </Box>
 );
}
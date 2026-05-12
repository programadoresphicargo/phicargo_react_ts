import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button
} from "@heroui/react";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import React from 'react';
import DispositivosSinAsignar from "./dispositivos";

type Props = {
    isOpen: boolean;
    onOpenChange: () => void;
};

const EmpleadosSinAsignarCelular: React.FC<Props> = ({
    isOpen,
    onOpenChange
}) => {

    const [value, setValue] = React.useState('1');

    const handleChange = (
        _: React.SyntheticEvent,
        newValue: string
    ) => {
        setValue(newValue);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="5xl"
                scrollBehavior="outside"
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
                                <Button color="danger" onPress={onClose} radius="full">
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

export default EmpleadosSinAsignarCelular;
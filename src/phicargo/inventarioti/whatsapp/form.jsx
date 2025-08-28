import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider, NumberInput, Input } from "@heroui/react";
import Stack from '@mui/material/Stack';

export default function WhatsAppContatcsForm({ isOpen, onOpenChange }) {

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" radius="lg">
            <ModalContent>
                <ModalHeader style={{ backgroundColor: '#25D366', color: 'white' }}>
                    <h1><i className="bi bi-whatsapp"></i> Nuevo contacto</h1>
                </ModalHeader>
                <Divider></Divider>
                <ModalBody>

                    <Stack direction="row" spacing={2} className="mt-5">
                        <Button color="success" className="text-white" onPress={() => onOpen1()}>Guardar</Button>
                    </Stack>

                    <Input
                        label="Nombre del contacto"
                        variant="bordered"
                    ></Input>

                    <NumberInput
                        label="Número celular"
                        variant="bordered">
                    </NumberInput>

                </ModalBody>
                <ModalFooter>
                    <Button color="success" onPress={onOpenChange} className="text-white">
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

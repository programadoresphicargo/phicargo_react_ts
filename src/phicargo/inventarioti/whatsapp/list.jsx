import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider } from "@heroui/react";

export default function WhatsAppContatcsTravel({ isOpen, onOpenChange }) {

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
            <ModalContent>
                <ModalHeader style={{ backgroundColor: '#25D366', color: 'white' }}>
                    <h1><i className="bi bi-whatsapp"></i> Contactos WhatsApp</h1>
                </ModalHeader>
                <Divider></Divider>
                <ModalBody>
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

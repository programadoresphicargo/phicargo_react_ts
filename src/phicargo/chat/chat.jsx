import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Input, Button, Card, ScrollShadow } from "@heroui/react";
import { useChatMessages } from './use-chat-messages';
import { ChatMessage } from './chat-message';
import odooApi from '@/api/odoo-api';
import { Progress } from "@heroui/react";

export default function Chatbot() {

    const { messages, addMessage } = useChatMessages();
    const [inputValue, setInputValue] = React.useState('');

    const [isLoading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (inputValue.trim()) {
            addMessage({ role: 'user', content: inputValue });
            setInputValue('');
            try {
                setLoading(true);
                const response = await odooApi.post('/chat/chat/', { "pregunta": inputValue });
                addMessage({ role: 'assistant', content: response.data.respuesta });
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        }
    };

    const scrollRef = React.useRef(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            <header className="p-6 border-b border-gray-300 bg-white shadow-sm">
                <h1 className="text-3xl font-extrabold text-center text-gray-800">
                    Phi-Cargo Asistente Virtual Demo
                </h1>
            </header>

            <main className="flex-1 flex justify-center items-center p-4">
                <Card className="flex flex-col w-full max-w-xl h-[80vh] shadow-lg rounded-xl overflow-hidden">
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-auto p-6 space-y-4 bg-white scroll-smooth"
                        style={{ scrollbarWidth: 'thin' }}
                    >
                        <ScrollShadow>
                            {messages.map((message, index) => (
                                <ChatMessage key={index} {...message} />
                            ))}
                        </ScrollShadow>
                    </div>

                    {(isLoading && (
                        <Progress isIndeterminate aria-label="Loading..." size="sm" />
                    ))}

                    < div className="p-4 border-t border-gray-300 bg-gray-50">
                        <div className="flex gap-3">
                            <Input
                                isDisabled={isLoading}
                                value={inputValue}
                                onValueChange={setInputValue}
                                placeholder="Escribe tu pregunta aquí..."
                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                className="flex-1"
                                endContent={
                                    <Button
                                        size="md"
                                        onPress={sendMessage}
                                        color="primary"
                                        isLoading={isLoading}
                                        className="transition-colors duration-200 hover:bg-primary-dark"
                                    >
                                        Enviar
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </Card>
            </main>
        </div >
    );
}
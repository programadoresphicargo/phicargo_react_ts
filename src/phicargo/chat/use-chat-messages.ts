import React from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const useChatMessages = () => {
    const [messages, setMessages] = React.useState<Message[]>([
        { role: 'assistant', content: 'Hola!, ¿En que te puedo ayudar el día de hoy?' }
    ]);

    const addMessage = (newMessage: Message) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    return { messages, addMessage };
};

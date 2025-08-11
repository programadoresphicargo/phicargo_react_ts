import React from 'react';
import { Avatar } from "@heroui/react";

interface ChatMessageProps {
    role: 'user' | 'assistant';
    content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
    const isUser = role === 'user';

    return (
        <div
            className={`flex gap-3 max-w-xl mx-auto
          ${isUser ? 'justify-end' : 'justify-start'}
          py-2`}
        >
            {!isUser && (
                <Avatar
                    classNames={{
                        base: 'bg-primary text-white',
                        icon: 'text-default-100',
                    }}
                />
            )}

            <div
                className={`
            rounded-lg px-4 py-2
            ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-900 rounded-bl-none'}
            max-w-[70%]
            break-words
          `}
            >
                <p className="text-xs font-semibold mb-1">{isUser ? 'Tú' : 'Chat Phicargo'}</p>
                <p className="text-sm whitespace-pre-wrap">{content}</p>
            </div>

            {isUser && (
                <Avatar
                    classNames={{
                        base: 'bg-default-100 text-default-500',
                        icon: 'text-default-500',
                    }}
                />
            )}
        </div>
    );
};

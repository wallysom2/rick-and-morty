import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

type ChatCharacter = 'rick' | 'morty';

interface UseChatReturn {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    character: ChatCharacter;
    setCharacter: (character: ChatCharacter) => void;
    sendMessage: (message: string) => Promise<void>;
    clearMessages: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function useChat(): UseChatReturn {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [character, setCharacter] = useState<ChatCharacter>('rick');

    // Keep history limited to last 10 messages for API calls
    const historyRef = useRef<ChatMessage[]>([]);

    useEffect(() => {
        historyRef.current = messages.slice(-10);
    }, [messages]);

    const sendMessage = useCallback(async (message: string) => {
        if (!message.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: message.trim() };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/chat`, {
                message: message.trim(),
                character,
                history: historyRef.current
            });

            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: response.data.response
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            const errorMessage = axios.isAxiosError(err)
                ? err.response?.data?.error || 'Failed to get response'
                : 'An unexpected error occurred';

            setError(errorMessage);

            // Add error message as assistant response
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `*burp* Something went wrong... ${errorMessage}`
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [character, isLoading]);

    const clearMessages = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

const handleSetCharacter = useCallback((newCharacter: ChatCharacter) => {
        if (newCharacter !== character) {
            setCharacter(newCharacter);
            setMessages([]);
            setError(null);
        }
    }, [character]);

    return {
        messages,
        isLoading,
        error,
        character,
        setCharacter: handleSetCharacter,
        sendMessage,
        clearMessages
    };
}

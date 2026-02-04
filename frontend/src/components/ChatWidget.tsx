import { useState, useRef, useEffect, type KeyboardEvent, type FormEvent } from 'react';
import { useChat } from '../hooks/useChat';

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        messages,
        isLoading,
        character,
        setCharacter,
        sendMessage,
        clearMessages
    } = useChat();

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const message = inputValue;
        setInputValue('');
        await sendMessage(message);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as FormEvent);
        }
    };

    const getCharacterAvatar = (isRick: boolean) => {
        return isRick
            ? 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
            : 'https://rickandmortyapi.com/api/character/avatar/2.jpeg';
    };

    return (
        <>
            {/* Botão Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#1a1a2e',
                    border: '2px solid #333',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.2s ease',
                    zIndex: 1000,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#4a9eff';
                    e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#333';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                )}
            </button>

            {/* Janela do Chat */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '90px',
                        right: '20px',
                        width: '360px',
                        maxWidth: 'calc(100vw - 40px)',
                        height: '480px',
                        maxHeight: 'calc(100vh - 120px)',
                        background: '#12121a',
                        borderRadius: '12px',
                        border: '1px solid #2a2a3a',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        zIndex: 999,
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: '14px 16px',
                            background: '#1a1a2e',
                            borderBottom: '1px solid #2a2a3a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                                src={getCharacterAvatar(character === 'rick')}
                                alt={character}
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    border: '2px solid #2a2a3a',
                                }}
                            />
                            <div>
                                <h3 style={{
                                    margin: 0,
                                    color: '#e0e0e0',
                                    fontSize: '14px',
                                    fontWeight: 600
                                }}>
                                    {character === 'rick' ? 'Rick Sanchez' : 'Morty Smith'}
                                </h3>
                                <p style={{
                                    margin: 0,
                                    color: '#666',
                                    fontSize: '11px'
                                }}>
                                    {character === 'rick' ? 'Cientista genial' : 'Parceiro nervoso'}
                                </p>
                            </div>
                        </div>

                        {/* Seletor de Personagem */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                                onClick={() => setCharacter('rick')}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: character === 'rick' ? '#2a4a7a' : '#1a1a2e',
                                    color: character === 'rick' ? '#7ab3ff' : '#666',
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                Rick
                            </button>
                            <button
                                onClick={() => setCharacter('morty')}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: character === 'morty' ? '#2a4a7a' : '#1a1a2e',
                                    color: character === 'morty' ? '#7ab3ff' : '#666',
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                Morty
                            </button>
                        </div>

                        {/* Botão Limpar */}
                        {messages.length > 0 && (
                            <button
                                onClick={clearMessages}
                                title="Limpar conversa"
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#555',
                                    fontSize: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#999';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#555';
                                }}
                            >
                                Limpar
                            </button>
                        )}
                    </div>

                    {/* Container de Mensagens */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            background: '#0d0d14',
                        }}
                    >
                        {messages.length === 0 && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    color: '#555',
                                    padding: '30px 16px',
                                }}
                            >
                                <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
                                    {character === 'rick'
                                        ? "Wubba lubba dub dub! *burp* Fala aí, o que você quer?"
                                        : "Ai caramba! O-oi! Posso ajudar com algo?"}
                                </p>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    gap: '8px',
                                }}
                            >
                                {msg.role === 'assistant' && (
                                    <img
                                        src={getCharacterAvatar(character === 'rick')}
                                        alt={character}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            flexShrink: 0,
                                        }}
                                    />
                                )}
                                <div
                                    style={{
                                        maxWidth: '70%',
                                        padding: '10px 14px',
                                        borderRadius: msg.role === 'user'
                                            ? '12px 12px 2px 12px'
                                            : '12px 12px 12px 2px',
                                        background: msg.role === 'user'
                                            ? '#2a4a7a'
                                            : '#1a1a2e',
                                        color: msg.role === 'user' ? '#c0d8ff' : '#b0b0b0',
                                        fontSize: '13px',
                                        lineHeight: 1.5,
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <img
                                    src={getCharacterAvatar(character === 'rick')}
                                    alt={character}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                    }}
                                />
                                <div
                                    style={{
                                        padding: '10px 14px',
                                        borderRadius: '12px 12px 12px 2px',
                                        background: '#1a1a2e',
                                        display: 'flex',
                                        gap: '4px',
                                    }}
                                >
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#555',
                                        animation: 'pulse 1s infinite',
                                        animationDelay: '0s'
                                    }} />
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#555',
                                        animation: 'pulse 1s infinite',
                                        animationDelay: '0.2s'
                                    }} />
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#555',
                                        animation: 'pulse 1s infinite',
                                        animationDelay: '0.4s'
                                    }} />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Área de Input */}
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            padding: '12px 14px',
                            borderTop: '1px solid #2a2a3a',
                            display: 'flex',
                            gap: '10px',
                            background: '#12121a',
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={character === 'rick' ? "Pergunte ao Rick..." : "Pergunte ao Morty..."}
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #2a2a3a',
                                background: '#0d0d14',
                                color: '#e0e0e0',
                                fontSize: '13px',
                                outline: 'none',
                                transition: 'border-color 0.2s ease',
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#3a5a8a';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = '#2a2a3a';
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            style={{
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: isLoading || !inputValue.trim()
                                    ? '#1a1a2e'
                                    : '#2a4a7a',
                                color: isLoading || !inputValue.trim() ? '#444' : '#a0c4ff',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Enviar
                        </button>
                    </form>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 0.8; transform: scale(1); }
                }
            `}</style>
        </>
    );
}

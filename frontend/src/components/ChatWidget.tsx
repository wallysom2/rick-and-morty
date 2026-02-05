import { useState, useRef, useEffect, type KeyboardEvent, type FormEvent } from 'react';
import { useChat } from '../hooks/useChat';

// Componente simples para renderizar Markdown básico (Negrito, Itálico, Code)
function SimpleMarkdown({ text }: { text: string }) {
    // Processa o texto para encontrar padrões básicos
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return (
        <span>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} className="text-[#00ff88] font-bold">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={index} className="italic text-gray-300">{part.slice(1, -1)}</em>;
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                    return (
                        <code key={index} className="bg-black/30 px-1.5 py-0.5 rounded text-sm font-mono text-[#4dffaa]">
                            {part.slice(1, -1)}
                        </code>
                    );
                }
                return part;
            })}
        </span>
    );
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const inputContainerRef = useRef<HTMLFormElement>(null);

    const {
        messages,
        isLoading,
        character,
        setCharacter,
        sendMessage,
        clearMessages
    } = useChat();

    // Auto-scroll para o final
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Focar no input ao abrir
    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isOpen]);

    // Auto-resize do textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [inputValue]);

    const handleSubmit = async (e?: FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const message = inputValue;
        setInputValue('');
        
        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        await sendMessage(message);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const getCharacterAvatar = (isRick: boolean) => {
        return isRick
            ? 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
            : 'https://rickandmortyapi.com/api/character/avatar/2.jpeg';
    };

    return (
        <>
            {/* Botão Flutuante (Toggle) - Apenas para abrir */}
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Abrir chat"
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-50 bg-[#00ff88] hover:bg-[#00cc6a] hover:-translate-y-1
                    ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
                style={{
                    boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)'
                }}
            >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>

            {/* Janela do Chat */}
            <div
                className={`fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-3rem)] flex flex-col rounded-2xl overflow-hidden transition-all duration-300 origin-bottom-right z-40
                    ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}
                style={{
                    height: '600px',
                    maxHeight: 'calc(100vh - 120px)',
                    backgroundColor: 'rgba(13, 17, 23, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--border-default)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={getCharacterAvatar(character === 'rick')}
                                alt={character}
                                className="w-10 h-10 rounded-full border-2 border-[#30363d]"
                            />
                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#161b22] ${isLoading ? 'animate-pulse bg-[#00ff88]' : 'bg-[#00ff88]'}`}></span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white leading-tight">
                                {character === 'rick' ? 'Rick Sanchez' : 'Morty Smith'}
                            </h3>
                            <p className="text-xs text-[#8b949e]">
                                {character === 'rick' ? 'Cientista C-137' : 'Neto do Rick'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
                            <button
                                onClick={() => setCharacter('rick')}
                                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                                    character === 'rick' 
                                        ? 'bg-[#21262d] text-white shadow-sm' 
                                        : 'text-[#8b949e] hover:text-white'
                                }`}
                            >
                                Rick
                            </button>
                            <button
                                onClick={() => setCharacter('morty')}
                                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                                    character === 'morty' 
                                        ? 'bg-[#21262d] text-white shadow-sm' 
                                        : 'text-[#8b949e] hover:text-white'
                                }`}
                            >
                                Morty
                            </button>
                        </div>
                        
                        {messages.length > 0 && (
                            <button
                                onClick={clearMessages}
                                className="p-2 md:p-1.5 text-[#8b949e] hover:text-[#ff4757] hover:bg-[#21262d] rounded-md transition-colors"
                                title="Limpar conversa"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        )}

                        {/* Universal Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-md transition-colors ml-1"
                            title="Fechar chat"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Área de Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                            <div className="w-16 h-16 bg-[#21262d] rounded-2xl flex items-center justify-center mb-4">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="1.5">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <p className="text-sm text-[#8b949e]">
                                {character === 'rick'
                                    ? "Fala logo o que você quer, *burp*, eu não tenho o dia todo."
                                    : "Oi! Pode perguntar qualquer coisa sobre nossas aventuras."}
                            </p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {msg.role === 'assistant' && (
                                <img
                                    src={getCharacterAvatar(character === 'rick')}
                                    alt={character}
                                    className="w-8 h-8 rounded-full border border-[#30363d] mt-1 mr-2"
                                />
                            )}
                            
                            <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user'
                                        ? 'bg-[#00ff88] text-[#0d1117] font-medium rounded-tr-sm'
                                        : 'bg-[#21262d] text-gray-100 rounded-tl-sm border border-[#30363d]'
                                }`}
                            >
                                <SimpleMarkdown text={msg.content} />
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start animate-pulse">
                            <img
                                src={getCharacterAvatar(character === 'rick')}
                                alt={character}
                                className="w-8 h-8 rounded-full border border-[#30363d] mt-1 mr-2"
                            />
                            <div className="bg-[#21262d] px-4 py-3 rounded-2xl rounded-tl-sm border border-[#30363d] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-[#8b949e] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                                <span className="w-1.5 h-1.5 bg-[#8b949e] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-1.5 h-1.5 bg-[#8b949e] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Área de Input */}
                <form 
                    ref={inputContainerRef}
                    onSubmit={handleSubmit}
                    className="p-3 bg-[#161b22]/90 border-t border-[#30363d] backdrop-blur-md"
                >
                    <div className="relative flex items-end gap-2 bg-[#0d1117] p-2 rounded-xl border border-[#30363d] focus-within:border-[#8b949e] transition-all">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`Pergunte ao ${character === 'rick' ? 'Rick' : 'Morty'}...`}
                            disabled={isLoading}
                            rows={1}
                            className="w-full bg-transparent text-white text-sm placeholder-[#6e7681] resize-none focus:outline-none focus:ring-0 focus-visible:outline-none !outline-none max-h-[120px] py-2 px-2 scrollbar-hide"
                            style={{ minHeight: '36px' }}
                        />
                        
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className={`p-2 rounded-lg transition-all flex-shrink-0 mb-0.5 ${
                                isLoading || !inputValue.trim()
                                    ? 'bg-[#21262d] text-[#484f58] cursor-not-allowed'
                                    : 'bg-[#00ff88] text-[#0d1117] hover:bg-[#00cc6a] hover:scale-105 active:scale-95 shadow-lg shadow-[#00ff88]/20'
                            }`}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                    <div className="text-[10px] text-[#6e7681] text-center mt-2 font-medium">
                        Pressione <span className="text-[#8b949e]">Enter</span> para enviar
                    </div>
                </form>
            </div>
        </>
    );
}

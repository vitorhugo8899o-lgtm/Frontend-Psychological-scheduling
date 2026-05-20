import React, { useState, useEffect, useRef } from 'react';
import {
    Heart,
    Home,
    Send,
    Loader2,
    AlertCircle,
    Menu,
    X,
    LogOut,
    Moon,
    Sun,
    ArrowLeft,
    MessageCircle,
    CalendarPlus,
    Settings,
    ClipboardList,
    FolderOpen,
    Search
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { SendMessage } from '../servicies/Groq';
import { Logout } from '../servicies/Users';
import SidebarButton from '../componentes/SidebarButton';

const WELCOME_MESSAGE = `Olá! 👋
Você está iniciando uma conversa com nosso agente de IA. Este ambiente foi criado para oferecer suporte, orientações e auxiliar em suas solicitações de forma rápida e segura.

Antes de continuar, leia atentamente as regras abaixo:

• Não tente explorar falhas, manipular respostas ou obter vantagens indevidas através do sistema.
• É proibido enviar conteúdos ofensivos, ilegais, discriminatórios ou maliciosos.
• Tentativas de fraude, engenharia social, invasão, coleta indevida de dados ou qualquer uso abusivo poderão resultar no banimento permanente da conta.
• Em casos graves, medidas administrativas e judiciais poderão ser tomadas conforme a legislação vigente.
• Todas as interações podem ser registradas para fins de segurança, auditoria e melhoria do serviço.

Ao continuar utilizando o chat, você concorda com estas diretrizes e com o uso responsável da plataforma.`;

export default function ChatMira() {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            type: 'agent',
            content: WELCOME_MESSAGE,
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputValue.trim()) return;

        const userMessage = {
            id: `user-${Date.now()}`,
            type: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setError(null);
        setIsLoading(true);

        try {
            let response = await SendMessage(inputValue);

            if (response && typeof response.json === 'function') {
                response = await response.json();
            }

            const data = response?.data ? response.data : response;

            let agentContent = '';

            if (data && data.response) {
                agentContent = data.response;
            } else if (typeof data === 'string') {
                agentContent = data;
            } else if (data && typeof data === 'object') {
                agentContent = data.message || data.content || JSON.stringify(data);
            } else {
                agentContent = 'Desculpe, não consegui processar sua mensagem.';
            }

            const agentMessage = {
                id: `agent-${Date.now()}`,
                type: 'agent',
                content: agentContent,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, agentMessage]);
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message || 'Erro ao enviar mensagem. Tente novamente.');

            const errorMessage = {
                id: `error-${Date.now()}`,
                type: 'error',
                content: err.message || 'Erro ao processar sua mensagem. Tente novamente.',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    const LogoutUser = async (e) => {
        e.preventDefault();

        const confirmLogout = window.confirm(
            'Você realmente deseja sair da sua conta?'
        );

        if (!confirmLogout) return;

        try {
            await Logout();
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Erro ao realizar logout:', error);
        }
    };

    return (
        <div
            className={`min-h-screen w-full flex flex-col transition-colors duration-300 overflow-hidden ${isDarkMode ? 'bg-[#0f172a] text-gray-100' : 'bg-[#FAF5EC] text-gray-800'
                }`}
        >
            <header
                className={`flex items-center justify-between p-4 md:px-8 border-b shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/home')}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode
                            ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                            : 'hover:bg-white/20 text-[#FAF5EC]'
                            }`}
                    >
                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <div className="flex items-center gap-2 text-lg md:text-xl font-semibold text-[#FAF5EC]">
                        <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-[#A60321]" />
                        <span className="truncate">Chatbot Mira</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2 text-[#FAF5EC] hover:bg-white/10 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6 md:w-7 md:h-7" />
                </button>
            </header>

            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col py-8 border-r transition-transform duration-300 transform h-full ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'
                    }`}
            >
                <div
                    className={`px-6 pb-8 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-800' : 'border-white/10'
                        }`}
                >
                    <div className="flex items-center gap-2 text-xl font-semibold text-[#FAF5EC]">
                        <Heart className="w-6 h-6 fill-[#0a0909] text-[#A60321] shrink-0" />
                        <span>Menu</span>
                    </div>
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[#FAF5EC] hover:bg-white/10 p-2 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                <nav className="flex-1 py-8 flex flex-col gap-1 overflow-y-auto">
                    <SidebarButton
                        icon={Home}
                        label="Início"
                        to="/home"
                    />

                    <SidebarButton
                        icon={CalendarPlus}
                        label="Marcar consulta"
                        to='/appoiment'
                    />

                    <SidebarButton
                        icon={FolderOpen}
                        label="Consultas em progresso"
                        to="/appoiments/in-progress"
                    />

                    <SidebarButton
                        icon={Search}
                        label="Busca avançada por serviços"
                        to="/filter-services"
                    />

                    <SidebarButton
                        icon={ClipboardList}
                        label="Minhas consultas"
                        to='/history-appoiment'
                    />

                    <SidebarButton
                        icon={Settings}
                        label="Configurações de conta."
                        to='/settings'
                    />

                    <SidebarButton
                        icon={LogOut}
                        label="Sair"
                        onClick={LogoutUser}
                    />
                </nav>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <div
                    className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-4 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#FAF5EC]'
                        }`}
                >
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'
                                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-2xl wrap-break-words whitespace-pre-wrap ${message.type === 'user'
                                    ? isDarkMode
                                        ? 'bg-[#A60321] text-white rounded-br-none'
                                        : 'bg-[#A60321] text-white rounded-br-none'
                                    : message.type === 'error'
                                        ? isDarkMode
                                            ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                                            : 'bg-red-100 border border-red-300 text-red-700'
                                        : isDarkMode
                                            ? 'bg-[#131c2e] border border-gray-700 text-gray-100'
                                            : 'bg-white border border-[#8C5C32]/15 text-gray-800'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed">
                                    {message.content}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div
                                className={`px-4 py-3 rounded-2xl ${isDarkMode
                                    ? 'bg-[#131c2e] border border-gray-700'
                                    : 'bg-white border border-[#8C5C32]/15'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Loader2 className={`w-4 h-4 animate-spin ${isDarkMode ? 'text-[#A60321]' : 'text-[#A60321]'
                                        }`} />
                                    <span
                                        className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}
                                    >
                                        Mira está digitando...
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {error && !isLoading && (
                    <div
                        className={`mx-4 md:mx-6 mb-4 p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top duration-300 ${isDarkMode
                            ? 'bg-red-500/10 border-red-500/20'
                            : 'bg-red-100 border-red-300'
                            }`}
                    >
                        <AlertCircle
                            className={`w-5 h-5 shrink-0 mt-0.5 ${isDarkMode ? 'text-red-400' : 'text-red-600'
                                }`}
                        />
                        <div className="flex flex-col gap-1">
                            <span
                                className={`text-sm font-medium ${isDarkMode ? 'text-red-400' : 'text-red-700'
                                    }`}
                            >
                                Erro ao processar mensagem
                            </span>
                            <span
                                className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                            >
                                {error}
                            </span>
                        </div>
                    </div>
                )}

                <div
                    className={`shrink-0 border-t transition-colors duration-300 p-4 md:p-6 ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-white border-[#8C5C32]/10'
                        }`}
                >
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            placeholder="Digite sua mensagem... (Shift+Enter para nova linha)"
                            className={`flex-1 px-4 py-3 rounded-xl border outline-none transition-all resize-none ${isDarkMode
                                ? 'bg-[#131c2e] border-gray-700 text-white placeholder-gray-500 focus:border-[#A60321] disabled:opacity-50 disabled:cursor-not-allowed'
                                : 'bg-gray-50 border-[#8C5C32]/20 text-gray-800 placeholder-gray-500 focus:border-[#A60321] disabled:opacity-50 disabled:cursor-not-allowed'
                                }`}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shrink-0 ${isLoading || !inputValue.trim()
                                ? isDarkMode
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : isDarkMode
                                    ? 'bg-[#A60321] text-white hover:bg-[#8a0219] active:scale-95'
                                    : 'bg-[#A60321] text-white hover:bg-[#8a0219] active:scale-95'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                            <span className="hidden sm:inline">Enviar</span>
                        </button>
                    </form>
                    <p
                        className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'
                            }`}
                    >
                        ℹ️ Pressione <kbd className={`px-2 py-0.5 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>Enter</kbd> para enviar, <kbd className={`px-2 py-0.5 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>Shift+Enter</kbd> para nova linha
                    </p>
                </div>
            </main>

            <button
                onClick={toggleTheme}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl flex items-center gap-2 font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 z-40 ${isDarkMode
                    ? 'bg-[#FAF5EC] text-[#4A2E14] hover:bg-[#ebdcc5]'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
            >
                {isDarkMode ? (
                    <>
                        <Sun className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <span className="hidden sm:inline">Modo Claro</span>
                    </>
                ) : (
                    <>
                        <Moon className="w-5 h-5 text-indigo-400 fill-indigo-400" />
                        <span className="hidden sm:inline">Modo Escuro</span>
                    </>
                )}
            </button>
        </div>
    );
}

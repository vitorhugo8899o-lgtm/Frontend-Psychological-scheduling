import React, { useState } from 'react';
import {
    Heart,
    Home,
    CalendarPlus,
    Search,
    ClipboardList,
    Calendar,
    FileText,
    Pill,
    Clock,
    Moon,
    Sun,
    Menu,
    X,
    LogOut
} from 'lucide-react';
import { Logout } from '../servicies/Users'
import { replace, useNavigate } from "react-router-dom";



export default function ClinicaHome() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();


    const sendPrompt = (text) => {
        console.log(`Prompt enviado: ${text}`);
    };

    const handleMenuClick = (text) => {
        if (text) sendPrompt(text);
        setIsMenuOpen(false);
    };

    const LogoutUser = async (e) => {
        e.preventDefault();

        const confirmLogout = window.confirm(
            'Você realmente deseja sair da sua conta?'
        );

        if (!confirmLogout) return;

        try {
            await Logout();
            navigate('/', { replace: true })
        } catch (error) {
            console.error('Erro ao realizar logout:', error);
        }
    };

    return (
        <div className={`min-h-screen w-full flex flex-col transition-colors duration-300 overflow-hidden ${isDarkMode ? 'bg-[#0f172a] text-gray-100' : 'bg-[#FAF5EC] text-gray-800'
            }`}>

            <header className={`flex items-center justify-between p-4 md:px-8 border-b shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'
                }`}>
                <div className="flex items-center gap-2 text-lg md:text-xl font-semibold text-[#FAF5EC]">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 fill-[#0a0909] text-[#A60321] shrink-0" />
                    <span className="truncate">Clínica Equilíbrio Mental</span>
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

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col py-8 border-r transition-transform duration-300 transform h-full
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'
                }`}>

                <div className={`px-6 pb-8 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-800' : 'border-white/10'}`}>
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
                    <button
                        onClick={() => handleMenuClick()}
                        className={`flex items-center gap-3.5 px-6 py-3.5 text-sm text-left border-l-4 border-[#A60321] bg-white/10 text-[#FAF5EC]`}
                    >
                        <Home className="w-5 h-5 text-[#A60321]" />
                        <span>Início</span>
                    </button>

                    <button
                        onClick={() => handleMenuClick('Quero marcar uma consulta')}
                        className="flex items-center gap-3.5 px-6 py-3.5 text-sm text-left border-l-4 border-transparent text-[#FAF5EC]/80 hover:text-[#FAF5EC] hover:bg-white/5 hover:border-[#A60321] transition-all"
                    >
                        <CalendarPlus className="w-5 h-5 text-gray-400" />
                        <span>Marcar consulta</span>
                    </button>

                    <button
                        onClick={() => handleMenuClick('Buscar serviços disponíveis')}
                        className="flex items-center gap-3.5 px-6 py-3.5 text-sm text-left border-l-4 border-transparent text-[#FAF5EC]/80 hover:text-[#FAF5EC] hover:bg-white/5 hover:border-[#A60321] transition-all"
                    >
                        <Search className="w-5 h-5 text-gray-400" />
                        <span>Busca avançada por serviços</span>
                    </button>

                    <button
                        onClick={() => handleMenuClick('Ver minhas consultas agendadas')}
                        className="flex items-center gap-3.5 px-6 py-3.5 text-sm text-left border-l-4 border-transparent text-[#FAF5EC]/80 hover:text-[#FAF5EC] hover:bg-white/5 hover:border-[#A60321] transition-all"
                    >
                        <ClipboardList className="w-5 h-5 text-gray-400" />
                        <span>Minhas consultas</span>
                    </button>
                    <button
                        onClick={LogoutUser}
                        className="flex items-center gap-3.5 px-6 py-3.5 text-sm text-left border-l-4 border-transparent text-[#FAF5EC]/80 hover:text-[#FAF5EC] hover:bg-white/5 hover:border-[#A60321] transition-all"
                    >
                        <LogOut className="w-5 h-5 text-gray-400" />
                        <span>Sair</span>
                    </button>
                </nav>
            </aside>

            <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full overflow-y-auto">
                <header className="mb-8 md:mb-10">
                    <h1 className={`text-2xl md:text-3xl font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                        Bem-vindo de volta!
                    </h1>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                        Sua saúde mental é o que importa.
                    </p>
                </header>

                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10">
                    <div
                        onClick={() => sendPrompt('Agendar nova consulta')}
                        className={`p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 hover:border-[#A60321] ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                            }`}
                    >
                        <Calendar className="w-7 h-7 text-[#A60321] mb-4" />
                        <h3 className={`text-base font-medium mb-1.5 ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>Agendar consulta</h3>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>Escolha especialidade, médico e horário disponível</p>
                    </div>

                    <div
                        onClick={() => sendPrompt('Histórico médico')}
                        className={`p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 hover:border-[#A60321] ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                            }`}
                    >
                        <FileText className="w-7 h-7 text-[#A60321] mb-4" />
                        <h3 className={`text-base font-medium mb-1.5 ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>Histórico médico</h3>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>Acesse seus registros e exames anteriores</p>
                    </div>

                    <div
                        onClick={() => sendPrompt('Receitas médicas')}
                        className={`p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 hover:border-[#A60321] ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                            }`}
                    >
                        <Pill className="w-7 h-7 text-[#A60321] mb-4" />
                        <h3 className={`text-base font-medium mb-1.5 ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>Receitas</h3>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>Visualize e renove suas prescrições médicas</p>
                    </div>
                </section>

                <section className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                    }`}>
                    <h2 className={`text-lg font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>
                        <Clock className="w-5 h-5 text-[#A60321]" />
                        Próximas consultas
                    </h2>

                    <div className="divide-y divide-gray-800/10 dark:divide-gray-800">
                        <div className="py-4 first:pt-0 last:pb-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-1">
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>Dr. Carlos Oliveira - Cardiologia</span>
                                <span className="text-xs font-semibold text-[#A60321]">Hoje, 14:30</span>
                            </div>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>Consulta de rotina</p>
                        </div>

                        <div className="py-4 first:pt-0 last:pb-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-1">
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>Dra. Ana Silva - Dermatologia</span>
                                <span className="text-xs font-semibold text-[#A60321]">Amanhã, 10:00</span>
                            </div>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>Avaliação dermatológica</p>
                        </div>

                        <div className="py-4 first:pt-0 last:pb-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-1">
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>Dr. Roberto Santos - Ortopedia</span>
                                <span className="text-xs font-semibold text-[#A60321]">23 Mai, 16:00</span>
                            </div>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>Retorno pós-cirúrgico</p>
                        </div>
                    </div>
                </section>
            </main>

            <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl flex items-center gap-2 font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 z-50 ${isDarkMode
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
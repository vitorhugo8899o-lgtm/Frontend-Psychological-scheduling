import React, { useState, useEffect } from 'react';
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
    LogOut,
    Loader2,
    AlertCircle,
    Settings
} from 'lucide-react';
import { Logout } from '../servicies/Users';
import { GetUserNextsAppoiments } from '../servicies/Appoiment';
import { useNavigate, Link } from "react-router-dom";
import SidebarButton from '../componentes/SidebarButton';

import { useTheme } from '../context/ThemeContext';

export default function ClinicaHome() {
    const { isDarkMode, toggleTheme } = useTheme();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function fetchAppointments() {
            try {
                setIsLoading(true);
                setApiError(null);

                const response = await GetUserNextsAppoiments();

                if (!isMounted) return;

                let data;

                if (response && typeof response.json === 'function') {
                    data = await response.json();
                } else {
                    data = response;
                }

                if (Array.isArray(data)) {
                    setAppointments(data);
                } else if (data && Array.isArray(data.data)) {
                    setAppointments(data.data);
                } else {
                    console.warn("O formato final dos dados não é um array válido:", data);
                    setAppointments([]);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Erro ao buscar consultas:", error);
                    setApiError(error.message || "Não foi possível carregar suas consultas.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchAppointments();

        return () => {
            isMounted = false;
        };
    }, []);

    const statusConfig = {
        confirmed: { label: 'Confirmada', className: 'bg-green-500/10 text-green-500' },
    };

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
            navigate('/', { replace: true });
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

                    <SidebarButton
                        icon={Home}
                        label="Início"
                        to="/home"
                        isActive
                    />

                    <SidebarButton
                        icon={CalendarPlus}
                        label="Marcar consulta"
                        onClick={() => handleMenuClick('Quero marcar uma consulta')}
                    />

                    <SidebarButton
                        icon={Search}
                        label="Busca avançada por serviços"
                        to="/filter-services"
                    />

                    <SidebarButton
                        icon={ClipboardList}
                        label="Minhas consultas"
                        onClick={() => handleMenuClick('Ver minhas consultas agendadas')}
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
                    <Link to="/simulation">
                        <div
                            className={`p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 hover:border-[#A60321] ${isDarkMode
                                ? 'bg-[#131c2e] border-gray-800'
                                : 'bg-white border-[#8C5C32]/15'
                                }`}
                        >
                            <Calendar className="w-7 h-7 text-[#A60321] mb-4" />

                            <h3
                                className={`text-base font-medium mb-1.5 ${isDarkMode
                                    ? 'text-gray-200'
                                    : 'text-[#4A2E14]'
                                    }`}
                            >
                                Simular agendamento
                            </h3>

                            <p
                                className={`text-xs leading-relaxed ${isDarkMode
                                    ? 'text-gray-400'
                                    : 'text-[#8C5C32]'
                                    }`}
                            >
                                Escolha uma data e horário para verificar quais profissionais estarão disponíveis nesse período.
                            </p>
                        </div>
                    </Link>

                    <div
                        onClick={() => sendPrompt('Histórico médico')}
                        className={`p-6 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 hover:border-[#A60321] ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                            }`}
                    >
                        <FileText className="w-7 h-7 text-[#A60321] mb-4" />
                        <h3 className={`text-base font-medium mb-1.5 ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>Histórico de consultas</h3>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>Acesse seus registros de consultas anteriores</p>
                    </div>
                </section>

                <section className={`p-6 rounded-2xl border transition-colors duration-300 ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                    }`}>
                    <h2 className={`text-lg font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>
                        <Clock className="w-5 h-5 text-[#A60321]" />
                        Próximas consultas
                    </h2>

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-8 gap-3">
                            <Loader2 className="w-8 h-8 text-[#A60321] animate-spin" />
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>Carregando suas consultas futures...</span>
                        </div>
                    )}

                    {!isLoading && apiError && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 my-2">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-red-500">Falha ao sincronizar agenda</span>
                                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{apiError}</span>
                            </div>
                        </div>
                    )}

                    {!isLoading && !apiError && appointments.length === 0 && (
                        <div className="text-center py-10">
                            <Calendar className={`w-10 h-10 mx-auto mb-3 opacity-40 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`} />
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>Você não possui consultas agendadas.</p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]/70'}`}>Quando precisar, clique em "Agendar consulta" acima.</p>
                        </div>
                    )}

                    {!isLoading && !apiError && appointments.length > 0 && (
                        <div className="divide-y divide-gray-800/10 dark:divide-gray-800">
                            {appointments.slice(0, 3).map((appointment) => {
                                const statusInfo = statusConfig[appointment.status] || { label: appointment.status, className: 'bg-gray-500/10 text-gray-500' };

                                return (
                                    <div key={appointment.id} className="py-5 first:pt-0 last:pb-0 flex flex-col gap-2">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                            <div>
                                                <h4 className={`text-sm font-semibold tracking-wide ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>
                                                    {appointment.psychologist?.user?.fullname || "Psicólogo não informado"}
                                                </h4>
                                                <p className={`text-xs font-medium mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                                                    CRP: {appointment.psychologist?.crp || "Não registrado"}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 sm:flex-col sm:items-end shrink-0">
                                                <span className="text-xs font-bold text-[#A60321]">
                                                    {appointment.datetime_format || "Data não disponível"}
                                                </span>
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusInfo.className}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                                            <span className="font-medium text-[#A60321]/90">
                                                {appointment.service?.name || "Consulta Geral"}
                                            </span>
                                            <span className="opacity-40">•</span>
                                            <span>Duração: {appointment.service?.duration_minutes || "--"} min</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            <button
                onClick={toggleTheme}
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
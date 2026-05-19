import React, { useState, useEffect } from 'react';
import {
    Heart,
    Home,
    CalendarPlus,
    ClipboardList,
    Settings,
    LogOut,
    Menu,
    X,
    Loader2,
    AlertCircle,
    Calendar,
    Clock,
    Sun,
    Moon,
    FileText
} from 'lucide-react';
import { Logout } from '../servicies/Users';
import { GetAllAppoimentsUser } from '../servicies/Appoiment';
import { useNavigate } from "react-router-dom";
import SidebarButton from '../componentes/SidebarButton';
import { useTheme } from '../context/ThemeContext';

export default function AppointmentHistory() {
    const { isDarkMode, toggleTheme } = useTheme();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function fetchAllAppointments() {
            try {
                setIsLoading(true);
                setApiError(null);

                const response = await GetAllAppoimentsUser();

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
                    console.error("Erro ao buscar histórico de consultas:", error);
                    setApiError(error.message || "Não foi possível carregar o histórico de consultas.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchAllAppointments();

        return () => {
            isMounted = false;
        };
    }, []);

    const statusConfig = {
        pending: {
            label: 'Pendente',
            className: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
        },
        canceled: {
            label: 'Cancelada',
            className: 'bg-red-500/10 text-red-500 border border-red-500/20'
        },
        confirmed: {
            label: 'Confirmada',
            className: 'bg-green-500/10 text-green-500 border border-green-500/20'
        },
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

    const SkeletonCard = () => (
        <div className={`p-6 rounded-2xl border animate-pulse ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
            }`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className={`h-4 rounded w-3/4 mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className={`h-3 rounded w-1/2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
                <div className={`h-6 w-6 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
            <div className="space-y-2">
                <div className={`h-3 rounded w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-3 rounded w-2/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
        </div>
    );

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

                <div className={`px-6 pb-8 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-800' : 'border-white/10'
                    }`}>
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
                        to="/appoiment"
                    />

                    <SidebarButton
                        icon={ClipboardList}
                        label="Minhas consultas"
                        isActive
                    />

                    <SidebarButton
                        icon={Settings}
                        label="Configurações de conta"
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
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-7 h-7 md:w-8 md:h-8 text-[#A60321]" />
                        <h1 className={`text-2xl md:text-3xl font-medium ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'
                            }`}>
                            Histórico de Consultas
                        </h1>
                    </div>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                        }`}>
                        Acompanhe todas as suas consultas realizadas e agendadas.
                    </p>
                </header>

                {isLoading && (
                    <div className="space-y-5">
                        {[1, 2, 3].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {!isLoading && apiError && (
                    <div className="flex items-start gap-3 p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-red-500">
                                Falha ao carregar histórico
                            </span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                {apiError}
                            </span>
                        </div>
                    </div>
                )}

                {!isLoading && !apiError && appointments.length === 0 && (
                    <div className={`text-center py-16 rounded-2xl border ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                        }`}>
                        <Calendar className={`w-16 h-16 mx-auto mb-4 opacity-30 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                            }`} />
                        <p className={`text-base font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'
                            }`}>
                            Você ainda não possui consultas registradas.
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]/70'
                            }`}>
                            Suas consultas futuras e passadas aparecerão aqui.
                        </p>
                    </div>
                )}

                {!isLoading && !apiError && appointments.length > 0 && (
                    <div className="space-y-5">
                        {appointments.map((appointment, index) => {
                            const statusInfo = statusConfig[appointment.status] || {
                                label: appointment.status,
                                className: 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                            };

                            return (
                                <div
                                    key={appointment.id}
                                    className={`p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-xl cursor-pointer group relative overflow-hidden
                                        ${isDarkMode
                                            ? 'bg-[#131c2e] border-gray-800 hover:border-[#A60321]/50'
                                            : 'bg-white border-[#8C5C32]/15 hover:border-[#A60321]/30'
                                        }
                                        animate-fade-in-up`}
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animationFillMode: 'backwards'
                                    }}
                                >
                                    <Heart
                                        className={`absolute top-4 right-4 w-8 h-8 opacity-5 transition-all duration-300 group-hover:opacity-10 group-hover:scale-110 ${isDarkMode ? 'text-[#A60321]' : 'text-[#A60321]'
                                            }`}
                                        fill="currentColor"
                                    />

                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 relative z-10">
                                        {/* Left Section */}
                                        <div className="flex-1 space-y-3">
                                            {/* Service Name */}
                                            <div>
                                                <h3 className={`text-lg font-semibold tracking-wide ${isDarkMode ? 'text-gray-100' : 'text-[#4A2E14]'
                                                    }`}>
                                                    {appointment.service?.name || "Consulta Geral"}
                                                </h3>
                                            </div>

                                            <div className="space-y-1">
                                                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'
                                                    }`}>
                                                    {appointment.psychologist?.user?.fullname || "Psicólogo não informado"}
                                                </p>
                                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                                                    }`}>
                                                    {appointment.psychologist?.crp || "CRP não registrado"}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-[#A60321]" />
                                                <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                                                    }`}>
                                                    Duração: {appointment.service?.duration_minutes || "--"} minutos
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-[#A60321]" />
                                                <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'
                                                    }`}>
                                                    {appointment.datetime_format || "Data não disponível"}
                                                </span>
                                            </div>

                                            <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider ${statusInfo.className}`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
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

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}

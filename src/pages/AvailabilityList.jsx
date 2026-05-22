import React, { useState, useEffect } from 'react';
import {
    Heart,
    Home,
    Settings,
    LogOut,
    Menu,
    X,
    AlertCircle,
    Calendar,
    Clock,
    Sun,
    Moon,
    BookOpenText,
    BookKey,
    Activity,
    Brain,
    BookMarked,
    ClipboardListIcon,
    CalendarDays,
    Trash2
} from 'lucide-react';
import { Logout } from '../servicies/Users';
import { GetAvaliabilitys, DeleteAvaliability } from '../servicies/Psych';
import { useNavigate } from "react-router-dom";
import SidebarButton from '../componentes/SidebarButton';
import { useTheme } from '../context/ThemeContext';

export default function AvailabilityList() {
    const { isDarkMode, toggleTheme } = useTheme();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [availabilities, setAvailabilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function fetchAvailabilities() {
            try {
                setIsLoading(true);
                setApiError(null);

                const response = await GetAvaliabilitys();

                if (!isMounted) return;

                let data;

                if (response && typeof response.json === 'function') {
                    data = await response.json();
                } else {
                    data = response;
                }

                let parsedData = [];
                if (Array.isArray(data)) {
                    parsedData = data;
                } else if (data && Array.isArray(data.data)) {
                    parsedData = data.data;
                } else {
                    console.warn("O formato final dos dados não é um array válido:", data);
                }

                parsedData.sort((a, b) => a.day_of_the_week - b.day_of_the_week);

                setAvailabilities(parsedData);

            } catch (error) {
                if (isMounted) {
                    console.error("Erro ao buscar horários de trabalho:", error);
                    setApiError(error.message || "Não foi possível carregar os horários de trabalho.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchAvailabilities();

        return () => {
            isMounted = false;
        };
    }, []);


    function formatTimeToTimezone(timeStr) {
        if (!timeStr) return "";

        const baseTime = timeStr.split(':').length === 2 ? `${timeStr}:00` : timeStr;

        const offsetMinutes = new Date().getTimezoneOffset();

        const sign = offsetMinutes > 0 ? "-" : "+";
        const absMinutes = Math.abs(offsetMinutes);
        const hours = String(Math.floor(absMinutes / 60)).padStart(2, '0');
        const mins = String(absMinutes % 60).padStart(2, '0');

        return `${baseTime}${sign}${hours}:${mins}`;
    }



    async function AvailabilityDelete(avail) {
        const confirmDelete = window.confirm('Deseja realmente excluir este horário da sua agenda?');
        if (!confirmDelete) return;

        try {
            const payload = {
                'days_of_the_week': avail.day_of_the_week,
                'start_time': formatTimeToTimezone(avail.start_time),
                'end_time': formatTimeToTimezone(avail.end_time)
            };

            await DeleteAvaliability(payload);

            setAvailabilities(prev => prev.filter(item =>
                !(item.day_of_the_week === avail.day_of_the_week &&
                    item.start_time === avail.start_time &&
                    item.end_time === avail.end_time)
            ));

        } catch (error) {
            console.error("Erro ao deletar disponibilidade:", error);
            alert("Não foi possível excluir o horário. Verifique o console ou tente novamente.");
        }
    }

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
            <div className="flex justify-between items-center mb-4">
                <div className={`h-5 rounded w-1/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-6 w-24 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex gap-4">
                <div className={`h-4 rounded w-20 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-20 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
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
                        to="/home-psych"
                    />

                    <SidebarButton
                        icon={ClipboardListIcon}
                        label="Lista de disponibilidade."
                        to='/avaliabilites'
                        isActive
                    />

                    <SidebarButton
                        icon={Clock}
                        label="Adicione um horário de trabalho."
                        to='/create-avaliabilite'
                    />

                    <SidebarButton
                        icon={Brain}
                        label="Histórico de consultas"
                        to='/psych-history'
                    />

                    <SidebarButton
                        icon={Activity}
                        label="Métricas de consultas."
                        to='/dashboard'
                    />

                    <SidebarButton
                        icon={BookMarked}
                        label="Crie um Prontuário."
                        to='/create-record'
                    />

                    <SidebarButton
                        icon={BookKey}
                        label="Busque uma lista de prontuários de um cliente."
                        to='/record-user'
                    />

                    <SidebarButton
                        icon={BookOpenText}
                        label="Lista de todos os prontuários criados."
                        to='/medical-records'
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
                        <CalendarDays className="w-7 h-7 md:w-8 md:h-8 text-[#A60321]" />
                        <h1 className={`text-2xl md:text-3xl font-medium ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'
                            }`}>
                            Horários de Trabalho
                        </h1>
                    </div>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                        }`}>
                        Visualize seus dias e horários disponíveis para atendimento.
                    </p>
                </header>

                {isLoading && (
                    <div className="space-y-5">
                        {[1, 2, 3, 4].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {!isLoading && apiError && (
                    <div className="flex items-start gap-3 p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-red-500">
                                Falha ao carregar horários
                            </span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                {apiError}
                            </span>
                        </div>
                    </div>
                )}

                {!isLoading && !apiError && availabilities.length === 0 && (
                    <div className={`text-center py-16 rounded-2xl border ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                        }`}>
                        <Calendar className={`w-16 h-16 mx-auto mb-4 opacity-30 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                            }`} />
                        <p className={`text-base font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'
                            }`}>
                            Nenhum horário cadastrado.
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]/70'
                            }`}>
                            Você ainda não possui configurações de disponibilidade em sua agenda.
                        </p>
                    </div>
                )}

                {!isLoading && !apiError && availabilities.length > 0 && (
                    <div className="space-y-4">
                        {availabilities.map((avail, index) => {
                            return (
                                <div
                                    key={`${avail.day_of_the_week}-${avail.start_time}-${index}`}
                                    className={`p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-xl cursor-default group relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4
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
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#FAF5EC]'}`}>
                                            <CalendarDays className="w-6 h-6 text-[#A60321]" />
                                        </div>
                                        <div>
                                            <h3 className={`text-lg font-semibold tracking-wide capitalize ${isDarkMode ? 'text-gray-100' : 'text-[#4A2E14]'
                                                }`}>
                                                {avail.day_name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="flex flex-col md:items-end gap-1">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-[#8C5C32]" />
                                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'
                                                    }`}>
                                                    Das <span className="font-bold">{(avail.start_time)}</span> às <span className="font-bold">{(avail.end_time)}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20`}>
                                            Disponível
                                        </span>

                                        <button
                                            onClick={() => AvailabilityDelete(avail)}
                                            className={`p-2 rounded-lg transition-colors flex items-center justify-center
                                            ${isDarkMode
                                                    ? 'text-red-500 hover:bg-red-500/10'
                                                    : 'text-red-600 hover:bg-red-50'
                                                }`}
                                            title="Excluir Horário"
                                        >
                                            <Trash2 className='w-5 h-5' />
                                        </button>
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
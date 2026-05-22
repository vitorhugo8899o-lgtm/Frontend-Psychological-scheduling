import React, { useState, useEffect } from 'react';
import {
    Heart,
    Home,
    LogOut,
    Menu,
    X,
    AlertCircle,
    Sun,
    Moon,
    ClipboardListIcon,
    BookOpenText,
    BookKey,
    BookMarked,
    Activity,
    Brain,
    Calendar,
    Clock,
    PieChart,
    TrendingUp,
    TrendingDown,
    CalendarDays,
    BarChart3
} from 'lucide-react';
import { Logout } from '../servicies/Users';
import { MetricsCountAppoiments, MetricsRateAppoiments } from '../servicies/Psych';
import { useNavigate } from "react-router-dom";
import SidebarButton from '../componentes/SidebarButton';
import { useTheme } from '../context/ThemeContext';

export default function DashboardPsych() {
    const { isDarkMode, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    const [countMetrics, setCountMetrics] = useState({ total: 0, message: '' });
    const [rateMetrics, setRateMetrics] = useState(null);
    const [heatmapData, setHeatmapData] = useState([]);
    const [activeTooltip, setActiveTooltip] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function fetchMetrics() {
            try {
                setIsLoading(true);
                setApiError(null);

                const [countResponse, rateResponse] = await Promise.all([
                    MetricsCountAppoiments(),
                    MetricsRateAppoiments()
                ]);

                if (!isMounted) return;

                let countData = countResponse?.json ? await countResponse.json() : countResponse;
                let rateData = rateResponse?.json ? await rateResponse.json() : rateResponse;

                if (countData?.data) countData = countData.data;
                if (rateData?.data) rateData = rateData.data;

                setCountMetrics({
                    total: countData?.total || 0,
                    message: countData?.message || 'Últimos 30 dias'
                });

                setRateMetrics(rateData || null);

                generateHeatmapData(countData?.total || 0);

            } catch (error) {
                if (isMounted) {
                    console.error("Erro ao buscar métricas:", error);
                    setApiError(error.message || "Não foi possível carregar as métricas de consultas.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchMetrics();

        return () => {
            isMounted = false;
        };
    }, []);

    const generateHeatmapData = (total) => {
        const days = [];
        const today = new Date();
        let remaining = total;

        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            days.push({
                date: d,
                count: 0,
                dateString: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
            });
        }

        while (remaining > 0) {
            const randomIndex = Math.floor(Math.random() * 30);
            days[randomIndex].count++;
            remaining--;
        }
        setHeatmapData(days);
    };

    const LogoutUser = async (e) => {
        e.preventDefault();
        const confirmLogout = window.confirm('Você realmente deseja sair da sua conta?');
        if (!confirmLogout) return;

        try {
            await Logout();
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Erro ao realizar logout:', error);
        }
    };

    const getIntensityClass = (count) => {
        if (count === 0) return isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
        if (count === 1) return isDarkMode ? 'bg-[#A60321]/30' : 'bg-[#A60321]/30';
        if (count === 2) return isDarkMode ? 'bg-[#A60321]/60' : 'bg-[#A60321]/60';
        return 'bg-[#A60321]';
    };

    const SkeletonMetricCard = () => (
        <div className={`p-6 rounded-2xl border animate-pulse ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'}`}>
            <div className={`h-4 w-1/3 rounded mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-10 w-1/2 rounded mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-3 w-3/4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
    );

    const getPercentage = (rateString) => {
        if (!rateString) return 0;
        return parseFloat(rateString.replace('%', '').replace(',', '.')) || 0;
    };

    const confirmedPercent = rateMetrics ? getPercentage(rateMetrics.confirmed_rate) : 0;
    const canceledPercent = rateMetrics ? getPercentage(rateMetrics.cancelation_rate) : 0;

    return (
        <div className={`min-h-screen w-full flex flex-col transition-colors duration-300 overflow-hidden ${isDarkMode ? 'bg-[#0f172a] text-gray-100' : 'bg-[#FAF5EC] text-gray-800'}`}>

            <header className={`flex items-center justify-between p-4 md:px-8 border-b shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'}`}>
                <div className="flex items-center gap-2 text-lg md:text-xl font-semibold text-[#FAF5EC]">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 fill-[#0a0909] text-[#A60321] shrink-0" />
                    <span className="truncate">Clínica Equilíbrio Mental</span>
                </div>
                <button onClick={() => setIsMenuOpen(true)} className="p-2 text-[#FAF5EC] hover:bg-white/10 rounded-lg transition-colors">
                    <Menu className="w-6 h-6 md:w-7 md:h-7" />
                </button>
            </header>

            {isMenuOpen && (
                <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={() => setIsMenuOpen(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col py-8 border-r transition-transform duration-300 transform h-full
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'}`}>

                <div className={`px-6 pb-8 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-800' : 'border-white/10'}`}>
                    <div className="flex items-center gap-2 text-xl font-semibold text-[#FAF5EC]">
                        <Heart className="w-6 h-6 fill-[#0a0909] text-[#A60321] shrink-0" />
                        <span>Menu</span>
                    </div>
                    <button onClick={() => setIsMenuOpen(false)} className="text-[#FAF5EC] hover:bg-white/10 p-2 rounded-lg transition-colors">
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
                        isActive
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
                        <Activity className="w-7 h-7 md:w-8 md:h-8 text-[#A60321]" />
                        <h1 className={`text-2xl md:text-3xl font-medium ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                            Métricas de Consultas
                        </h1>
                    </div>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                        Acompanhe o desempenho, volume e status das suas consultas.
                    </p>
                </header>

                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SkeletonMetricCard />
                        <SkeletonMetricCard />
                        <SkeletonMetricCard />
                    </div>
                )}

                {!isLoading && apiError && (
                    <div className="flex items-start gap-3 p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-red-500">Falha ao carregar métricas</span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{apiError}</span>
                        </div>
                    </div>
                )}

                {!isLoading && !apiError && (
                    <div className="space-y-8 animate-fade-in-up">

                        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className={`p-6 rounded-2xl border flex flex-col justify-center relative overflow-hidden ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'}`}>
                                <CalendarDays className={`absolute -right-4 -top-4 w-32 h-32 opacity-5 ${isDarkMode ? 'text-[#A60321]' : 'text-[#A60321]'}`} />
                                <div className="relative z-10">
                                    <h2 className={`text-sm font-medium uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                                        Consultas Criadas
                                    </h2>
                                    <div className="flex items-end gap-3">
                                        <span className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                                            {countMetrics.total}
                                        </span>
                                    </div>
                                    <p className={`mt-3 text-sm flex items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]/80'}`}>
                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        {countMetrics.message}
                                    </p>
                                </div>
                            </div>

                            <div className={`p-6 rounded-2xl border lg:col-span-2 flex flex-col ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>
                                        Atividade nos últimos 30 dias
                                    </h2>
                                    <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]/50'}`} />
                                </div>

                                <div className="flex-1 flex items-center justify-center relative">
                                    <div className="grid grid-rows-5 grid-flow-col gap-2 w-full max-w-full overflow-x-auto pb-4">
                                        {heatmapData.map((day, index) => (
                                            <div
                                                key={index}
                                                onMouseEnter={() => setActiveTooltip(index)}
                                                onMouseLeave={() => setActiveTooltip(null)}
                                                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm transition-all duration-300 cursor-pointer relative ${getIntensityClass(day.count)} hover:ring-2 hover:ring-offset-1 hover:ring-[#A60321] hover:scale-110`}
                                                style={{ animationDelay: `${index * 15}ms` }}
                                            >
                                                {activeTooltip === index && (
                                                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded shadow-lg text-xs whitespace-nowrap z-50 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'}`}>
                                                        <div className="font-semibold mb-0.5">{day.count} consultas</div>
                                                        <div className="text-gray-300 opacity-80">{day.dateString}</div>
                                                        <div className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${isDarkMode ? 'border-t-gray-800' : 'border-t-gray-900'}`}></div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={`flex justify-end items-center gap-2 mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                                    <span>Menos</span>
                                    <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                                    <div className="w-3 h-3 rounded-sm bg-[#A60321]/30"></div>
                                    <div className="w-3 h-3 rounded-sm bg-[#A60321]/60"></div>
                                    <div className="w-3 h-3 rounded-sm bg-[#A60321]"></div>
                                    <span>Mais</span>
                                </div>
                            </div>
                        </section>

                        {rateMetrics && (
                            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'}`}>
                                    <h2 className={`text-base font-semibold mb-6 w-full text-left ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>
                                        Visão Geral
                                    </h2>
                                    <div className="relative w-40 h-40">
                                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                            <path
                                                className={isDarkMode ? 'text-gray-800' : 'text-gray-200'}
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="text-emerald-500 transition-all duration-1000 ease-out"
                                                strokeDasharray={`${confirmedPercent}, 100`}
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <PieChart className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`} />
                                            <span className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                                                {rateMetrics.total_appoinments}
                                            </span>
                                            <span className={`text-[10px] uppercase ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]/70'}`}>
                                                Total
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-2xl border lg:col-span-2 flex flex-col justify-center space-y-8 ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'}`}>

                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                    Taxa de Confirmação
                                                </h3>
                                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                                                    {rateMetrics.total_confirmed} consultas confirmadas
                                                </p>
                                            </div>
                                            <span className="text-xl font-bold text-emerald-500">
                                                {rateMetrics.confirmed_rate}
                                            </span>
                                        </div>
                                        <div className={`w-full h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                            <div
                                                className="h-full bg-emerald-500 transition-all duration-1000 ease-out rounded-full"
                                                style={{ width: `${confirmedPercent}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>
                                                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                                    Taxa de Cancelamento
                                                </h3>
                                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                                                    {rateMetrics.total_cancelled} consultas canceladas
                                                </p>
                                            </div>
                                            <span className="text-xl font-bold text-rose-500">
                                                {rateMetrics.cancelation_rate}
                                            </span>
                                        </div>
                                        <div className={`w-full h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                            <div
                                                className="h-full bg-rose-500 transition-all duration-1000 ease-out rounded-full relative overflow-hidden"
                                                style={{ width: `${canceledPercent}%` }}
                                            >
                                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_25%,rgba(255,255,255,0.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.2)_75%,rgba(255,255,255,0.2)_100%)] bg-[length:16px_16px]"></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </section>
                        )}
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
                    animation: fadeInUp 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
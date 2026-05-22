import React, { useState, useEffect } from 'react';
import {
    Heart,
    Home,
    LogOut,
    Menu,
    X,
    AlertCircle,
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
    ChevronDown,
    Check,
    Save,
    CheckCircle
} from 'lucide-react';
import { Logout } from '../servicies/Users';
import { CreateAvaibility } from '../servicies/Psych';
import { useNavigate } from "react-router-dom";
import SidebarButton from '../componentes/SidebarButton';
import { useTheme } from '../context/ThemeContext';

const DAYS_OF_THE_WEEK_MAP = [
    { value: 0, label: 'Segunda-feira' },
    { value: 1, label: 'Terça-feira' },
    { value: 2, label: 'Quarta-feira' },
    { value: 3, label: 'Quinta-feira' },
    { value: 4, label: 'Sexta-feira' },
    { value: 5, label: 'Sábado' },
    { value: 6, label: 'Domingo' }
];

export default function CreateAvailability() {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [selectedDays, setSelectedDays] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [isDaysDropdownOpen, setIsDaysDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    useEffect(() => {
        if (successMsg) {
            const timer = setTimeout(() => {
                setSuccessMsg(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMsg]);

    const toggleDaySelection = (dayValue) => {
        setSelectedDays(prev =>
            prev.includes(dayValue)
                ? prev.filter(d => d !== dayValue)
                : [...prev, dayValue].sort((a, b) => a - b)
        );
    };

    const removeDay = (e, dayValue) => {
        e.stopPropagation();
        setSelectedDays(prev => prev.filter(d => d !== dayValue));
    };

    const formatTimeForPayload = (timeStr) => {
        if (!timeStr) return null;
        return `${timeStr}:00.000Z`;
    };

    const validateForm = () => {
        if (selectedDays.length === 0) {
            return "Por favor, selecione pelo menos um dia da semana.";
        }
        if (!startTime) {
            return "O horário inicial é obrigatório.";
        }
        if (!endTime) {
            return "O horário final é obrigatório.";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        const validationError = validateForm();
        if (validationError) {
            setErrorMsg(validationError);
            return;
        }

        try {
            setIsLoading(true);

            const payload = {
                days_of_the_week: selectedDays,
                start_time: formatTimeForPayload(startTime),
                end_time: formatTimeForPayload(endTime)
            };

            await CreateAvaibility(payload);

            setSuccessMsg('Horário criado com sucesso!');
            setSelectedDays([]);
            setStartTime('');
            setEndTime('');

        } catch (error) {
            console.error("Erro ao cadastrar disponibilidade:", error);
            setErrorMsg(error.message || "Não foi possível cadastrar o horário. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
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

    return (
        <div className={`min-h-screen w-full flex flex-col transition-colors duration-300 overflow-hidden ${isDarkMode ? 'bg-[#0f172a] text-gray-100' : 'bg-[#FAF5EC] text-gray-800'}`}>

            <header className={`flex items-center justify-between p-4 md:px-8 border-b shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'}`}>
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
                ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'}`}>

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
                        isActive
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
                        <Clock className="w-7 h-7 md:w-8 md:h-8 text-[#A60321]" />
                        <h1 className={`text-2xl md:text-3xl font-medium ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                            Adicionar Disponibilidade
                        </h1>
                    </div>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                        Configure os dias e horários que você estará disponível para atender seus pacientes.
                    </p>
                </header>

                <div className="max-w-2xl">
                    {errorMsg && (
                        <div className="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 animate-fade-in-up">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-red-500">Atenção</span>
                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {errorMsg}
                                </span>
                            </div>
                        </div>
                    )}

                    {successMsg && (
                        <div className="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-green-500/10 border border-green-500/20 animate-fade-in-up">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-green-500">Sucesso</span>
                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {successMsg}
                                </span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={`p-6 md:p-8 rounded-2xl border transition-all duration-500 ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'} animate-fade-in-up`}>

                        <div className="mb-8">
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                Dias da Semana
                            </label>
                            <div className="relative">
                                <div
                                    onClick={() => setIsDaysDropdownOpen(!isDaysDropdownOpen)}
                                    className={`min-h-12.5 w-full p-3 rounded-xl border cursor-pointer flex flex-wrap items-center justify-between gap-2 transition-colors ${isDarkMode
                                        ? 'bg-[#0f172a] border-gray-700 hover:border-gray-600   text-gray-200'
                                        : 'bg-[#FAF5EC]/50 border-[#8C5C32]/30 hover:border-[#8C5C32]/50 text-gray-800'
                                        }`}
                                >
                                    <div className="flex flex-wrap gap-2 flex-1">
                                        {selectedDays.length === 0 ? (
                                            <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                Selecione os dias disponíveis...
                                            </span>
                                        ) : (
                                            selectedDays.map(val => {
                                                const dayLabel = DAYS_OF_THE_WEEK_MAP.find(d => d.value === val).label;
                                                return (
                                                    <span
                                                        key={val}
                                                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg ${isDarkMode
                                                            ? 'bg-[#A60321]/20 text-[#A60321] border border-[#A60321]/30'
                                                            : 'bg-[#A60321]/10 text-[#A60321] border border-[#A60321]/20'
                                                            }`}
                                                    >
                                                        {dayLabel}
                                                        <X
                                                            className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform"
                                                            onClick={(e) => removeDay(e, val)}
                                                        />
                                                    </span>
                                                )
                                            })
                                        )}
                                    </div>
                                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${isDaysDropdownOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                </div>

                                {isDaysDropdownOpen && (
                                    <div className={`absolute z-20 w-full mt-2 py-2 rounded-xl border shadow-xl ${isDarkMode ? 'bg-[#1e293b] border-gray-700' : 'bg-white border-[#8C5C32]/20'
                                        }`}>
                                        {DAYS_OF_THE_WEEK_MAP.map((day) => {
                                            const isSelected = selectedDays.includes(day.value);
                                            return (
                                                <div
                                                    key={day.value}
                                                    onClick={() => toggleDaySelection(day.value)}
                                                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${isDarkMode
                                                        ? 'hover:bg-[#0f172a]'
                                                        : 'hover:bg-[#FAF5EC]'
                                                        }`}
                                                >
                                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>
                                                        {day.label}
                                                    </span>
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected
                                                        ? 'bg-[#A60321] border-[#A60321]'
                                                        : (isDarkMode ? 'border-gray-600' : 'border-gray-300')
                                                        }`}>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                    Horário Inicial
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]/70'}`} />
                                    </div>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-colors ${isDarkMode
                                            ? 'bg-[#0f172a] border-gray-700 text-gray-200 focus:border-[#A60321]/50'
                                            : 'bg-[#FAF5EC]/50 border-[#8C5C32]/30 text-gray-800 focus:border-[#A60321]/50'
                                            } time-input-custom`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                    Horário Final
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]/70'}`} />
                                    </div>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-colors ${isDarkMode
                                            ? 'bg-[#0f172a] border-gray-700 text-gray-200 focus:border-[#A60321]/50'
                                            : 'bg-[#FAF5EC]/50 border-[#8C5C32]/30 text-gray-800 focus:border-[#A60321]/50'
                                            } time-input-custom`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-dashed border-gray-500/20">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-6 py-3 rounded-xl font-medium text-white flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95
                                    ${isLoading ? 'bg-[#A60321]/70 cursor-not-allowed' : 'bg-[#A60321] hover:shadow-lg hover:shadow-[#A60321]/20'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Salvar Horários</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
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
                    animation: fadeInUp 0.6s ease-out backwards;
                }

                .time-input-custom::-webkit-calendar-picker-indicator {
                    cursor: pointer;
                    opacity: 0.6;
                    filter: invert(${isDarkMode ? '1' : '0'});
                }
                .time-input-custom::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Heart,
    Home,
    CalendarPlus,
    Search,
    ClipboardList,
    Calendar,
    Clock,
    Moon,
    Sun,
    Menu,
    X,
    LogOut,
    Loader2,
    AlertCircle
} from 'lucide-react';

import { GetAllServices } from '../servicies/Services';
import { SimulationAppoiment } from '../servicies/Appoiment';
import { Logout } from '../servicies/Users';
import SidebarButton from '../componentes/SidebarButton';
import { useTheme } from '../context/ThemeContext';


export default function Simulation() {
    const { isDarkMode, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedService, setSelectedService] = useState('');

    const [services, setServices] = useState([]);
    const [psychologists, setPsychologists] = useState([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const [isSimulating, setIsSimulating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const navigate = useNavigate();

    const today = (() => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    })();

    const maxDate = (() => {
        const now = new Date();
        now.setMonth(now.getMonth() + 1);
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    })();

    useEffect(() => {
        let isMounted = true;

        async function loadServices() {
            try {
                setIsLoadingServices(true);
                setErrorMessage('');
                const response = await GetAllServices();

                if (!isMounted) return;

                let data;
                if (response && typeof response.json === 'function') {
                    data = await response.json();
                } else {
                    data = response;
                }

                if (Array.isArray(data)) {
                    setServices(data);
                } else if (data && Array.isArray(data.data)) {
                    setServices(data.data);
                } else {
                    setServices([]);
                }
            } catch (error) {
                if (isMounted) {
                    setErrorMessage(error.message || "Não foi possível carregar os serviços.");
                }
            } finally {
                if (isMounted) {
                    setIsLoadingServices(false);
                }
            }
        }

        loadServices();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSimulationSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate || !selectedTime || !selectedService) return;

        setErrorMessage('');

        const [year, month, day] = selectedDate.split('-').map(Number);
        const [hours, minutes] = selectedTime.split(':').map(Number);

        const selectedDateTimeObj = new Date(year, month - 1, day, hours, minutes, 0, 0);
        const now = new Date();

        if (selectedDateTimeObj < now) {
            setErrorMessage("Não é possível realizar uma simulação para uma data ou horário que já passou.");
            return;
        }

        setIsSimulating(true);
        setHasSearched(true);

        const formattedDateTimeUTC = selectedDateTimeObj.toISOString();

        try {
            const response = await SimulationAppoiment({
                date_time: formattedDateTimeUTC,
                service_id: Number(selectedService)
            });

            let data;
            if (response && typeof response.json === 'function') {
                data = await response.json();
            } else {
                data = response;
            }

            if (Array.isArray(data)) {
                setPsychologists(data);
            } else if (data && Array.isArray(data.data)) {
                setPsychologists(data.data);
            } else {
                setPsychologists([]);
            }

        } catch (error) {
            setErrorMessage(error.message || "Erro ao buscar disponibilidades.");
            setPsychologists([]);
        } finally {
            setIsSimulating(false);
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
                        icon={LogOut}
                        label="Sair"
                        onClick={LogoutUser}
                    />

                </nav>
            </aside>

            <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full overflow-y-auto">
                <header className="mb-8 md:mb-10">
                    <h1 className={`text-2xl md:text-3xl font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                        Simulação de Consulta
                    </h1>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                        Verifique a disponibilidade de profissionais para o seu agendamento.
                    </p>
                </header>

                {errorMessage && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-red-500">Atenção</span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{errorMessage}</span>
                        </div>
                    </div>
                )}

                <section className={`p-6 rounded-2xl border mb-10 transition-colors duration-300 ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                    }`}>
                    <form onSubmit={handleSimulationSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

                        <div className="flex flex-col gap-2">
                            <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-[#4A2E14]'}`}>Data</label>
                            <input
                                type="date"
                                min={today}
                                max={maxDate}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className={`p-3 rounded-xl border text-sm outline-none focus:border-[#A60321] transition-all w-full ${isDarkMode ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-[#FAF5EC]/50 border-gray-200 text-gray-800'
                                    }`}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-[#4A2E14]'}`}>Horário</label>
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className={`p-3 rounded-xl border text-sm outline-none focus:border-[#A60321] transition-all w-full ${isDarkMode ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-[#FAF5EC]/50 border-gray-200 text-gray-800'
                                    }`}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-[#4A2E14]'}`}>Serviço</label>
                            <select
                                id="service-select"
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                disabled={isLoadingServices}
                                className={`p-3 rounded-xl border text-sm outline-none focus:border-[#A60321] transition-all w-full ${isDarkMode ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-[#FAF5EC]/50 border-gray-200 text-gray-800'
                                    }`}
                                required
                            >
                                <option value="">
                                    {isLoadingServices ? "Carregando serviços..." : "Selecione um serviço"}
                                </option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSimulating || isLoadingServices}
                                className="bg-[#A60321] text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-[#85021a] transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSimulating && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isSimulating ? "Sincronizando..." : "Simular Disponibilidade"}
                            </button>
                        </div>
                    </form>
                </section>

                <section>
                    <h2 className={`text-lg font-medium mb-6 flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>
                        <Search className="w-5 h-5 text-[#A60321]" />
                        Profissionais Disponíveis
                    </h2>

                    {isSimulating ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-[#A60321] animate-spin" />
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>Sincronizando com a base de dados...</p>
                        </div>
                    ) : psychologists.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {psychologists.map((psico) => (
                                <div
                                    key={psico.id}
                                    className={`p-6 rounded-2xl border transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#131c2e] border-gray-800 shadow-none' : 'bg-white border-[#8C5C32]/15 shadow-sm'
                                        }`}
                                >
                                    <div className="w-12 h-12 bg-[#A60321]/10 rounded-full flex items-center justify-center mb-4">
                                        <Heart className="w-6 h-6 text-[#A60321]" />
                                    </div>
                                    <h3 className={`text-base font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                                        {psico.fullname}
                                    </h3>
                                    <p className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-500 rounded-md inline-block">
                                        CRP: {psico.crp}
                                    </p>
                                    <div className={`mt-4 pt-4 border-t text-[10px] ${isDarkMode ? 'border-gray-800 text-gray-500' : 'border-gray-100 text-[#8C5C32]/60'
                                        }`}>
                                        Profissional compatível com o horário selecionado
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : hasSearched ? (
                        <div className={`text-center py-16 rounded-2xl border border-dashed ${isDarkMode ? 'border-gray-800 bg-[#131c2e]/30' : 'border-[#8C5C32]/20 bg-white'
                            }`}>
                            <Calendar className={`w-12 h-12 mx-auto mb-4 opacity-20 ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`} />
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-[#4A2E14]'}`}>Nenhum profissional encontrado.</p>
                            <p className="text-xs text-gray-500 mt-1">Tente outra combinação de data regulamentar.</p>
                        </div>
                    ) : (
                        <div className="text-center py-16 opacity-40">
                            <Clock className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-[#8C5C32]'}`} />
                            <p className="text-xs uppercase tracking-widest font-bold">Aguardando dados da simulação</p>
                        </div>
                    )}
                </section>
            </main>

            <button
                onClick={toggleTheme}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl flex items-center gap-2 font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 z-50 ${isDarkMode ? 'bg-[#FAF5EC] text-[#4A2E14] hover:bg-[#ebdcc5]' : 'bg-gray-900 text-white hover:bg-gray-800'
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

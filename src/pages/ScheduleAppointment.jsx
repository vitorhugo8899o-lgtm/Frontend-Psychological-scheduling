import React, { useState, useEffect } from 'react';
import {
    Heart,
    Home,
    CalendarPlus,
    Search,
    ClipboardList,
    Clock,
    Moon,
    Sun,
    Menu,
    X,
    LogOut,
    Loader2,
    AlertCircle,
    Settings,
    Lightbulb,
    Calendar,
    User,
    Briefcase,
    CheckCircle,
    ArrowRight,
    FolderOpen
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Logout } from '../servicies/Users';
import { CreateAppointment } from '../servicies/Appoiment';
import { GetAllPsychs } from '../servicies/Psych';
import { GetAllServices } from '../servicies/Services';
import SidebarButton from '../componentes/SidebarButton';
import { useTheme } from '../context/ThemeContext';

export default function ScheduleAppoiment() {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [psychologists, setPsychologists] = useState([]);
    const [services, setServices] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [apiError, setApiError] = useState(null);

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        serviceId: '',
        psychologistId: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [successData, setSuccessData] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                setIsLoadingData(true);
                setApiError(null);

                const [psychsResponse, servicesResponse] = await Promise.all([
                    GetAllPsychs(),
                    GetAllServices()
                ]);

                if (!isMounted) return;

                let psychsData = psychsResponse?.json ? await psychsResponse.json() : psychsResponse;
                psychsData = Array.isArray(psychsData) ? psychsData : (psychsData?.data || []);

                let servicesData = servicesResponse?.json ? await servicesResponse.json() : servicesResponse;
                servicesData = Array.isArray(servicesData) ? servicesData : (servicesData?.data || []);

                setPsychologists(psychsData);
                setServices(servicesData);
            } catch (error) {
                if (isMounted) {
                    console.error("Erro ao carregar dados do formulário:", error);
                    setApiError("Não foi possível carregar os dados necessários para o agendamento.");
                }
            } finally {
                if (isMounted) {
                    setIsLoadingData(false);
                }
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    const validateForm = () => {
        const errors = {};

        if (!formData.date) {
            errors.date = "A data da consulta é obrigatória.";
        } else {
            const [year, month, day] = formData.date.split('-').map(Number);
            const selectedDate = new Date(year, month - 1, day);

            const today = new Date();
            const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            const maxFutureDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

            if (selectedDate < currentDate) {
                errors.date = "Não é permitido agendar consultas em datas no passado.";
            } else if (selectedDate > maxFutureDate) {
                const maxDay = String(maxFutureDate.getDate()).padStart(2, '0');
                const maxMonth = String(maxFutureDate.getMonth() + 1).padStart(2, '0');
                const maxYear = maxFutureDate.getFullYear();

                errors.date = `O limite máximo de antecedência é de 1 mês. Escolha uma data até ${maxDay}/${maxMonth}/${maxYear}.`;
            }
        }

        if (!formData.time) errors.time = "O horário da consulta é obrigatório.";
        if (!formData.serviceId) errors.serviceId = "Selecione um serviço.";
        if (!formData.psychologistId) errors.psychologistId = "Selecione um psicólogo.";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setIsSubmitting(true);

            const dateTimeString = `${formData.date}T${formData.time}:00`;
            const localDateTime = new Date(dateTimeString);

            if (isNaN(localDateTime.getTime())) {
                throw new Error('Data ou horário inválido.');
            }

            const utcDatetimeString = localDateTime.toISOString();

            const [year, month, day] = formData.date.split('-');
            const formattedDateBR = `${day}/${month}/${year} ${formData.time}`;

            const payload = {
                psychologist_id: Number(formData.psychologistId),
                service_id: Number(formData.serviceId),
                date_time: utcDatetimeString
            };

            const response = await CreateAppointment(payload);

            let result = response?.json ? await response.json() : response;

            const appointmentSummary = {
                id: result?.id || Math.floor(Math.random() * 90000) + 10000,
                psychologist_id: payload.psychologist_id,
                status: result?.status || 'confirmed',
                datetime_format: formattedDateBR
            };

            setSuccessData(appointmentSummary);

        } catch (error) {
            console.error("Erro ao realizar agendamento:", error);
            setFormErrors({
                submit: error.message || "Erro ao processar o agendamento. Tente novamente."
            });
        } finally {
            setIsSubmitting(false);
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

    const themeClasses = {
        wrapper: isDarkMode ? 'bg-[#0f172a] text-gray-100' : 'bg-[#FAF5EC] text-gray-800',
        header: isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent',
        sidebar: isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent',
        card: isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15',
        input: isDarkMode
            ? 'bg-[#090d16] border-gray-800 text-white focus:border-[#A60321]'
            : 'bg-white border-[#8C5C32]/30 text-gray-800 focus:border-[#A60321]',
        title: isDarkMode ? 'text-white' : 'text-[#4A2E14]',
        subtitle: isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
    };

    return (
        <div className={`min-h-screen w-full flex flex-col transition-colors duration-300 overflow-hidden ${themeClasses.wrapper}`}>

            <header className={`flex items-center justify-between p-4 md:px-8 border-b shrink-0 transition-colors duration-300 ${themeClasses.header}`}>
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
                <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={() => setIsMenuOpen(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col py-8 border-r transition-transform duration-300 transform h-full
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${themeClasses.sidebar}`}>

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
                        to="/home" />

                    <SidebarButton
                        icon={CalendarPlus}
                        label="Marcar consulta"
                        to="/schedule" isActive />

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

            <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-4xl mx-auto w-full overflow-y-auto">
                <header className="mb-8">
                    <h1 className={`text-2xl md:text-3xl font-medium mb-2 ${themeClasses.title}`}>
                        Marcar Consulta
                    </h1>
                    <p className={`text-sm md:text-base ${themeClasses.subtitle}`}>
                        Preencha as informações abaixo para reservar seu atendimento personalizado.
                    </p>
                </header>

                <div className={`p-5 rounded-2xl border flex gap-4 items-start mb-8 transition-colors ${isDarkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                    <Lightbulb className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-sm leading-relaxed">
                        <p className="font-semibold mb-1">Já sabe qual psicólogo estará disponível na data desejada?</p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-amber-800'}>
                            Caso ainda não saiba, utilize o botão <strong className="font-semibold text-[#A60321]">"Simular Consulta"</strong> disponível na tela inicial. Essa funcionalidade foi criada para ajudar o usuário a encontrar rapidamente horários disponíveis sem precisar testar manualmente cada psicólogo.
                        </p>
                    </div>
                </div>

                {successData ? (
                    <div className={`p-6 md:p-8 rounded-2xl border text-center ${themeClasses.card} shadow-xl animate-fadeIn`}>
                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className={`text-xl font-semibold mb-6 ${themeClasses.title}`}>Consulta Agendada com Sucesso!</h2>

                        <div className="max-w-md mx-auto rounded-xl border border-dashed border-gray-500/30 p-5 mb-8 text-left bg-black/5 dark:bg-white/5 space-y-3">
                            <div className="flex justify-between border-b border-gray-500/10 pb-2 text-sm">
                                <span className={themeClasses.subtitle}>ID da Consulta:</span>
                                <span className="font-mono font-bold">{successData.id}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-500/10 pb-2 text-sm">
                                <span className={themeClasses.subtitle}>ID do Psicólogo:</span>
                                <span className="font-medium">{successData.psychologist_id}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-500/10 pb-2 text-sm">
                                <span className={themeClasses.subtitle}>Status:</span>
                                <span className="text-xs uppercase font-bold bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                                    {successData.status === 'confirmed' ? 'Confirmada' : successData.status}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm pt-1">
                                <span className={themeClasses.subtitle}>Data e Hora:</span>
                                <span className="font-bold text-[#A60321]">{successData.datetime_format}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => console.log("Integrando com Gateway de Pagamento...")}
                            className="w-full sm:w-auto px-8 py-3.5 bg-[#A60321] text-white font-medium rounded-xl shadow-lg shadow-[#A60321]/20 hover:bg-[#A60321]/90 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto"
                        >
                            Prosseguir para pagamento
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={`p-6 md:p-8 rounded-2xl border ${themeClasses.card} space-y-6 shadow-sm`}>
                        {apiError && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div className="flex flex-col gap-1 flex-1">
                                    <span className="text-sm font-medium text-red-500">Erro de Carregamento</span>
                                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{apiError}</span>
                                    <button
                                        type="button"
                                        onClick={() => window.location.reload()}
                                        className="text-xs font-semibold text-[#A60321] underline text-left mt-1 hover:opacity-80"
                                    >
                                        Tentar novamente
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className={`text-xs font-semibold tracking-wide uppercase ${themeClasses.subtitle} flex items-center gap-1`}>
                                    <Calendar className="w-3.5 h-3.5 text-[#A60321]" /> Data da Consulta
                                </label>
                                <input
                                    type="date"
                                    className={`${themeClasses.input} p-3 rounded-xl border`}
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    disabled={isLoadingData}
                                />
                                {formErrors.date && <span className="text-xs text-red-500 font-medium mt-0.5">{formErrors.date}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className={`text-xs font-semibold tracking-wide uppercase ${themeClasses.subtitle} flex items-center gap-1`}>
                                    <Clock className="w-3.5 h-3.5 text-[#A60321]" /> Hora da Consulta
                                </label>
                                <input
                                    type="time"
                                    className={`${themeClasses.input} p-3 rounded-xl border`}
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    disabled={isLoadingData}
                                />
                                {formErrors.time && <span className="text-xs text-red-500 font-medium mt-0.5">{formErrors.time}</span>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={`text-xs font-semibold tracking-wide uppercase ${themeClasses.subtitle} flex items-center gap-1`}>
                                <Briefcase className="w-3.5 h-3.5 text-[#A60321]" /> Serviço
                            </label>
                            {isLoadingData ? (
                                <div className={`w-full h-12 animate-pulse rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                            ) : (
                                <select
                                    className={`${themeClasses.input} p-3 rounded-xl border appearance-none`}
                                    value={formData.serviceId}
                                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                >
                                    <option value="">Selecione o serviço...</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.name} — R$ {service.price} ({service.duration_minutes} min)
                                        </option>
                                    ))}
                                </select>
                            )}
                            {formErrors.serviceId && <span className="text-xs text-red-500 font-medium mt-0.5">{formErrors.serviceId}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={`text-xs font-semibold tracking-wide uppercase ${themeClasses.subtitle} flex items-center gap-1`}>
                                <User className="w-3.5 h-3.5 text-[#A60321]" /> Psicólogo
                            </label>
                            {isLoadingData ? (
                                <div className={`w-full h-12 animate-pulse rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                            ) : (
                                <select
                                    className={`${themeClasses.input} p-3 rounded-xl border appearance-none`}
                                    value={formData.psychologistId}
                                    onChange={(e) => setFormData({ ...formData, psychologistId: e.target.value })}
                                >
                                    <option value="">Selecione o profissional...</option>
                                    {psychologists.map((psych) => (
                                        <option key={psych.id} value={psych.id}>
                                            {psych.fullname}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {formErrors.psychologistId && <span className="text-xs text-red-500 font-medium mt-0.5">{formErrors.psychologistId}</span>}
                        </div>

                        {formErrors.submit && (
                            <div className="text-sm text-red-500 font-medium text-center bg-red-500/10 p-3 rounded-xl border border-red-500/10">
                                {formErrors.submit}
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoadingData || isSubmitting}
                                className="w-full py-3.5 bg-[#A60321] text-white font-medium rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none hover:opacity-90 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Agendando consulta...
                                    </>
                                ) : (
                                    "Confirmar Agendamento"
                                )}
                            </button>
                        </div>
                    </form>
                )}
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
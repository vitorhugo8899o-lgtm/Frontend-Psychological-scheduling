import React, { useState, useEffect } from 'react';
import {
    Heart,
    Home,
    CalendarPlus,
    ClipboardList,
    Calendar,
    Clock,
    Moon,
    Sun,
    Menu,
    X,
    LogOut,
    Loader2,
    AlertCircle,
    Settings,
    DollarSign,
    XCircle,
    CalendarClock,
    CheckCircle2
} from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";

import { Logout } from '../servicies/Users';
import {
    GetAppoimentOpen,
    CancelAppoiment,
    RescheduleAppointment,

} from '../servicies/Appoiment';
import { GetPaymentLink } from '../servicies/Payment';

import SidebarButton from '../componentes/SidebarButton';
import { useTheme } from '../context/ThemeContext';

export default function AppointmentsInProgress() {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    const [loadingActions, setLoadingActions] = useState({});

    const [rescheduleModal, setRescheduleModal] = useState({
        isOpen: false,
        appointmentId: null,
        newDate: '',
        newTime: ''
    });

    const [notification, setNotification] = useState({
        show: false,
        type: '',
        message: ''
    });

    useEffect(() => {
        let isMounted = true;

        async function fetchAppointments() {
            try {
                setIsLoading(true);
                setApiError(null);

                const response = await GetAppoimentOpen();

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
                    console.warn("Formato de dados inesperado:", data);
                    setAppointments([]);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Erro ao buscar consultas:", error);
                    setApiError(error.message || "Não foi possível carregar suas consultas em progresso.");
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

    const showNotification = (type, message, duration = 5000) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, duration);
    };

    const handlePayment = async (appointment) => {
        const actionKey = `pay-${appointment.id}`;

        const newTab = window.open('about:blank', '_blank', 'noopener,noreferrer');

        try {
            setLoadingActions(prev => ({ ...prev, [actionKey]: true }));

            const response = await GetPaymentLink(appointment.id);

            let responseData = response;
            if (response && typeof response.json === 'function') {
                responseData = await response.json();
            } else if (response && response.data) {
                responseData = response.data;
            }

            console.log("Retorno do backend (Pagamento):", responseData);

            let paymentUrl = null;

            if (typeof responseData === 'string' && responseData.startsWith('http')) {
                paymentUrl = responseData;
            } else if (responseData && typeof responseData === 'object') {
                paymentUrl = responseData.checkout_url ||
                    responseData.payment_link ||
                    responseData.payment_url ||
                    responseData.url ||
                    responseData.init_point ||
                    responseData.link;
            }

            if (paymentUrl && typeof paymentUrl === 'string' && paymentUrl.startsWith('http')) {
                if (newTab) {
                    newTab.location.href = paymentUrl;
                } else {
                    window.location.href = paymentUrl;
                }
                showNotification('success', 'Redirecionando para o Mercado Pago...');
            } else {
                if (newTab && !newTab.closed) {
                    newTab.close();
                }
                console.error("Link não encontrado dentro do objeto:", responseData);
                throw new Error('A resposta do servidor não continha um link de pagamento válido.');
            }

        } catch (error) {
            if (newTab && !newTab.closed) {
                newTab.close();
            }
            console.error("Erro ao processar pagamento:", error);
            showNotification('error', error.message || 'Não foi possível iniciar o pagamento.');
        } finally {
            setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
        }
    };

    const handleCancel = async (appointment) => {
        const confirmCancel = window.confirm(
            `Tem certeza que deseja cancelar a consulta com ${appointment.psychologist?.user?.fullname || 'o profissional'}?`
        );

        if (!confirmCancel) return;

        const actionKey = `cancel-${appointment.id}`;

        try {
            setLoadingActions(prev => ({ ...prev, [actionKey]: true }));

            await CancelAppoiment({ id_appointment: appointment.id });

            setAppointments(prev => prev.filter(apt => apt.id !== appointment.id));

            showNotification('success', 'Consulta cancelada com sucesso!');
        } catch (error) {
            console.error("Erro ao cancelar consulta:", error);
            showNotification('error', error.message || 'Não foi possível cancelar a consulta.');
        } finally {
            setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
        }
    };

    const openRescheduleModal = (appointment) => {
        setRescheduleModal({
            isOpen: true,
            appointmentId: appointment.id,
            appointment: appointment,
            newDate: '',
            newTime: ''
        });
    };

    const closeRescheduleModal = () => {
        setRescheduleModal({
            isOpen: false,
            appointmentId: null,
            appointment: null,
            newDate: '',
            newTime: ''
        });
    };

    const handleRescheduleSubmit = async () => {
        if (!rescheduleModal.newDate || !rescheduleModal.newTime) {
            showNotification('error', 'Por favor, selecione uma data e horário válidos.');
            return;
        }

        const dateTimeString = `${rescheduleModal.newDate}T${rescheduleModal.newTime}:00`;
        const newDateTime = new Date(dateTimeString);

        if (newDateTime <= new Date()) {
            showNotification('error', 'A data e horário devem ser no futuro.');
            return;
        }

        const actionKey = `reschedule-${rescheduleModal.appointmentId}`;

        try {
            setLoadingActions(prev => ({ ...prev, [actionKey]: true }));

            const response = await RescheduleAppointment({
                id_appointment: rescheduleModal.appointmentId,
                date_new: newDateTime.toISOString()
            });

            let data;
            if (response && typeof response.json === 'function') {
                data = await response.json();
            } else {
                data = response;
            }

            setAppointments(prev => prev.map(apt =>
                apt.id === rescheduleModal.appointmentId ? { ...apt, ...data } : apt
            ));

            showNotification('success', 'Consulta remarcada com sucesso!');
            closeRescheduleModal();
        } catch (error) {
            console.error("Erro ao remarcar consulta:", error);
            showNotification('error', error.message || 'Não foi possível remarcar a consulta.');
        } finally {
            setLoadingActions(prev => ({ ...prev, [actionKey]: false }));
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

    const statusConfig = {
        pending: { label: 'Pendente', className: 'bg-yellow-500/10 text-yellow-500' },
        confirmed: { label: 'Confirmada', className: 'bg-green-500/10 text-green-500' },
        in_progress: { label: 'Em Progresso', className: 'bg-blue-500/10 text-blue-500' },
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
                ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'}`}>

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
                        label="Agendar consulta"
                        to="/simulation"
                    />

                    <SidebarButton
                        icon={Clock}
                        label="Consultas em Progresso"
                        to="/appointments-in-progress"
                        isActive
                    />

                    <SidebarButton
                        icon={ClipboardList}
                        label="Minhas consultas"
                        to='/history-appoiment'
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
                    <h1 className={`text-2xl md:text-3xl font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'
                        }`}>
                        Consultas em Progresso
                    </h1>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                        }`}>
                        Gerencie suas consultas abertas e pendentes
                    </p>
                </header>

                {notification.show && (
                    <div className={`mb-6 p-4 rounded-xl border transition-all duration-300 animate-in slide-in-from-top ${notification.type === 'success'
                        ? 'bg-green-500/10 border-green-500/20'
                        : 'bg-red-500/10 border-red-500/20'
                        }`}>
                        <div className="flex items-start gap-3">
                            {notification.type === 'success' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 flex items-start justify-between gap-3">
                                <div className="flex flex-col gap-1">
                                    <span className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                        {notification.type === 'success' ? 'Sucesso!' : 'Erro'}
                                    </span>
                                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        {notification.message}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setNotification({ show: false, type: '', message: '' })}
                                    className={`p-1 rounded hover:bg-white/10 transition-colors ${notification.type === 'success' ? 'text-green-500' : 'text-red-500'
                                        }`}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className={`p-6 rounded-2xl border transition-colors duration-300 ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                        }`}>
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <Loader2 className="w-8 h-8 text-[#A60321] animate-spin" />
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                                }`}>
                                Carregando suas consultas em progresso...
                            </span>
                        </div>
                    </div>
                )}

                {!isLoading && apiError && (
                    <div className={`p-6 rounded-2xl border transition-colors duration-300 ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                        }`}>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-red-500">
                                    Falha ao carregar consultas
                                </span>
                                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {apiError}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {!isLoading && !apiError && appointments.length === 0 && (
                    <div className={`p-6 rounded-2xl border transition-colors duration-300 ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                        }`}>
                        <div className="text-center py-12">
                            <Clock className={`w-12 h-12 mx-auto mb-3 opacity-40 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                                }`} />
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'
                                }`}>
                                Você não possui consultas em progresso
                            </p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]/70'
                                }`}>
                                Suas consultas agendadas aparecerão aqui
                            </p>
                        </div>
                    </div>
                )}

                {!isLoading && !apiError && appointments.length > 0 && (
                    <div className="grid grid-cols-1 gap-5">
                        {appointments.map((appointment) => {
                            const statusInfo = statusConfig[appointment.status] || {
                                label: appointment.status,
                                className: 'bg-gray-500/10 text-gray-500'
                            };

                            const payActionKey = `pay-${appointment.id}`;
                            const cancelActionKey = `cancel-${appointment.id}`;

                            return (
                                <div
                                    key={appointment.id}
                                    className={`p-6 rounded-2xl border transition-all duration-300 hover:border-[#A60321] ${isDarkMode
                                        ? 'bg-[#131c2e] border-gray-800'
                                        : 'bg-white border-[#8C5C32]/15'
                                        }`}
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                            <div className="flex-1">
                                                <h3 className={`text-lg font-semibold tracking-wide ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'
                                                    }`}>
                                                    {appointment.psychologist?.user?.fullname || "Profissional não informado"}
                                                </h3>
                                                <p className={`text-xs font-medium mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                                                    }`}>
                                                    CRP: {appointment.psychologist?.crp || "Não registrado"}
                                                </p>
                                            </div>
                                            <span className={`text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider shrink-0 self-start ${statusInfo.className
                                                }`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-[#A60321]" />
                                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'
                                                    }`}>
                                                    {appointment.datetime_format || "Data não disponível"}
                                                </span>
                                            </div>
                                            <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                                                }`}>
                                                <span className="font-medium text-[#A60321]/90">
                                                    {appointment.service?.name || "Consulta Geral"}
                                                </span>
                                                <span className="opacity-40">•</span>
                                                <span>
                                                    Duração: {appointment.service?.duration_minutes || "--"} min
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                            <button
                                                onClick={() => handlePayment(appointment)}
                                                disabled={loadingActions[payActionKey]}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${isDarkMode
                                                    ? 'bg-[#A60321] text-white hover:bg-[#8a0219] disabled:bg-gray-700 disabled:text-gray-500'
                                                    : 'bg-[#A60321] text-white hover:bg-[#8a0219] disabled:bg-gray-300 disabled:text-gray-500'
                                                    } disabled:cursor-not-allowed`}
                                            >
                                                {loadingActions[payActionKey] ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Gerando link...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <DollarSign className="w-4 h-4" />
                                                        <span>Pagar Consulta</span>
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => openRescheduleModal(appointment)}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 border ${isDarkMode
                                                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                                                    : 'border-[#8C5C32]/20 text-[#4A2E14] hover:bg-[#8C5C32]/5'
                                                    }`}
                                            >
                                                <CalendarClock className="w-4 h-4" />
                                                <span>Remarcar</span>
                                            </button>

                                            <button
                                                onClick={() => handleCancel(appointment)}
                                                disabled={loadingActions[cancelActionKey]}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 border ${isDarkMode
                                                    ? 'border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:border-gray-700 disabled:text-gray-500'
                                                    : 'border-red-500/30 text-red-600 hover:bg-red-50 disabled:border-gray-300 disabled:text-gray-500'
                                                    } disabled:cursor-not-allowed`}
                                            >
                                                {loadingActions[cancelActionKey] ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Cancelando...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-4 h-4" />
                                                        <span>Cancelar</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {rescheduleModal.isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 z-50 transition-opacity"
                        onClick={closeRescheduleModal}
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className={`w-full max-w-md p-6 rounded-2xl border transition-all duration-300 ${isDarkMode
                                ? 'bg-[#131c2e] border-gray-800'
                                : 'bg-white border-[#8C5C32]/15'
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'
                                        }`}>
                                        Remarcar Consulta
                                    </h2>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                                        }`}>
                                        Selecione uma nova data e horário
                                    </p>
                                </div>
                                <button
                                    onClick={closeRescheduleModal}
                                    className={`p-2 rounded-lg transition-colors ${isDarkMode
                                        ? 'text-gray-400 hover:bg-gray-800'
                                        : 'text-[#8C5C32] hover:bg-[#8C5C32]/5'
                                        }`}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {rescheduleModal.appointment && (
                                <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-gray-800/50' : 'bg-[#8C5C32]/5'
                                    }`}>
                                    <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                                        }`}>
                                        Consulta atual:
                                    </p>
                                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'
                                        }`}>
                                        {rescheduleModal.appointment.psychologist?.user?.fullname}
                                    </p>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                                        }`}>
                                        {rescheduleModal.appointment.datetime_format}
                                    </p>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'
                                    }`}>
                                    Nova Data
                                </label>
                                <input
                                    type="date"
                                    value={rescheduleModal.newDate}
                                    onChange={(e) => setRescheduleModal(prev => ({
                                        ...prev,
                                        newDate: e.target.value
                                    }))}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${isDarkMode
                                        ? 'bg-gray-800/50 border-gray-700 text-white focus:border-[#A60321]'
                                        : 'bg-white border-[#8C5C32]/20 text-[#4A2E14] focus:border-[#A60321]'
                                        } focus:outline-none focus:ring-2 focus:ring-[#A60321]/20`}
                                />
                            </div>

                            <div className="mb-6">
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'
                                    }`}>
                                    Novo Horário
                                </label>
                                <input
                                    type="time"
                                    value={rescheduleModal.newTime}
                                    onChange={(e) => setRescheduleModal(prev => ({
                                        ...prev,
                                        newTime: e.target.value
                                    }))}
                                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${isDarkMode
                                        ? 'bg-gray-800/50 border-gray-700 text-white focus:border-[#A60321]'
                                        : 'bg-white border-[#8C5C32]/20 text-[#4A2E14] focus:border-[#A60321]'
                                        } focus:outline-none focus:ring-2 focus:ring-[#A60321]/20`}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={closeRescheduleModal}
                                    className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 border ${isDarkMode
                                        ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                                        : 'border-[#8C5C32]/20 text-[#4A2E14] hover:bg-[#8C5C32]/5'
                                        }`}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleRescheduleSubmit}
                                    disabled={loadingActions[`reschedule-${rescheduleModal.appointmentId}`]}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${isDarkMode
                                        ? 'bg-[#A60321] text-white hover:bg-[#8a0219] disabled:bg-gray-700 disabled:text-gray-500'
                                        : 'bg-[#A60321] text-white hover:bg-[#8a0219] disabled:bg-gray-300 disabled:text-gray-500'
                                        } disabled:cursor-not-allowed`}
                                >
                                    {loadingActions[`reschedule-${rescheduleModal.appointmentId}`] ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Remarcando...</span>
                                        </>
                                    ) : (
                                        <span>Confirmar</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

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
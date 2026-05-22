import React, { useState, useEffect } from 'react';
import {
    Heart,
    Home,
    LogOut,
    Menu,
    X,
    Loader2,
    AlertCircle,
    Sun,
    Moon,
    ClipboardListIcon,
    BookOpenText,
    BookKey,
    BookMarked,
    Activity,
    Brain,
    FileText,
    Clock,
    CheckCircle2,
    Save
} from 'lucide-react';
import { Logout } from '../servicies/Users';
import { GetHistoryAppoiment, CreateRecord } from '../servicies/Psych';
import { useNavigate } from "react-router-dom";
import SidebarButton from '../componentes/SidebarButton';
import { useTheme } from '../context/ThemeContext';

export default function MedicalRecord() {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

    const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
    const [description, setDescription] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({ type: null, message: '' });
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        let isMounted = true;

        async function fetchAppointments() {
            try {
                setIsLoadingAppointments(true);
                const response = await GetHistoryAppoiment();

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
                    setAppointments([]);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Erro ao buscar histórico para seleção:", error);
                    setFeedback({
                        type: 'error',
                        message: 'Não foi possível carregar as consultas. Tente recarregar a página.'
                    });
                }
            } finally {
                if (isMounted) {
                    setIsLoadingAppointments(false);
                }
            }
        }

        fetchAppointments();

        return () => {
            isMounted = false;
        };
    }, []);

    const validateForm = () => {
        const errors = {};

        if (!selectedAppointmentId) {
            errors.appointment = "Selecione uma consulta válida.";
        }

        if (!description || description.trim().length < 10) {
            errors.description = "A descrição não pode estar vazia e deve conter pelo menos 10 caracteres.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ type: null, message: '' });

        if (!validateForm()) return;

        const selectedAppointment = appointments.find(
            app => app.id.toString() === selectedAppointmentId.toString()
        );

        if (!selectedAppointment) {
            setFeedback({ type: 'error', message: 'Erro ao identificar a consulta selecionada.' });
            return;
        }

        const id_user = selectedAppointment.client?.id || selectedAppointment.id_user;
        const id_appoiment = selectedAppointment.id;

        const payload = {
            id_user: Number(id_user),
            id_appoiment: Number(id_appoiment),
            description: description.trim()
        };

        try {
            setIsSubmitting(true);

            await CreateRecord(payload);

            setFeedback({
                type: 'success',
                message: 'Prontuário criado com sucesso!'
            });

            setSelectedAppointmentId('');
            setDescription('');
            setValidationErrors({});

        } catch (error) {
            console.error("Erro ao criar prontuário:", error);
            setFeedback({
                type: 'error',
                message: error.message || 'Ocorreu um erro ao criar o prontuário. Tente novamente mais tarde.'
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

    const inputBaseStyles = `w-full rounded-xl p-4 text-sm outline-none transition-all duration-300 border focus:ring-2 
        ${isDarkMode
            ? 'bg-[#131c2e] text-gray-100 placeholder-gray-500'
            : 'bg-white text-[#4A2E14] placeholder-[#8C5C32]/60'
        }`;

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
                ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'}
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
                        isActive
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

            <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-4xl mx-auto w-full overflow-y-auto">
                <header className="mb-8 md:mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-2">
                        <BookMarked className="w-7 h-7 md:w-8 md:h-8 text-[#A60321]" />
                        <h1 className={`text-2xl md:text-3xl font-medium ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                            Criação de Prontuário
                        </h1>
                    </div>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                        Preencha as informações clínicas detalhadas sobre a consulta selecionada.
                    </p>
                </header>

                {feedback.type && (
                    <div className={`p-4 mb-8 rounded-xl border flex items-start gap-3 animate-fade-in-up ${feedback.type === 'success'
                        ? (isDarkMode ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-50 border-green-200 text-green-700')
                        : (isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700')
                        }`}>
                        {feedback.type === 'success' ? (
                            <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                        )}
                        <p className="font-medium">{feedback.message}</p>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className={`p-6 md:p-8 rounded-2xl border transition-all duration-500 shadow-sm animate-fade-in-up ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                        }`}
                    style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}
                >
                    <div className="space-y-6 md:space-y-8">

                        <div className="space-y-2">
                            <label htmlFor="appointment" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'
                                }`}>
                                Selecione a Consulta / Paciente <span className="text-[#A60321]">*</span>
                            </label>

                            <div className="relative">
                                <select
                                    id="appointment"
                                    value={selectedAppointmentId}
                                    onChange={(e) => setSelectedAppointmentId(e.target.value)}
                                    disabled={isLoadingAppointments}
                                    className={`appearance-none cursor-pointer ${inputBaseStyles} ${validationErrors.appointment
                                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                                        : (isDarkMode ? 'border-gray-700 focus:ring-[#A60321]/20 focus:border-[#A60321]' : 'border-[#8C5C32]/30 focus:ring-[#A60321]/20 focus:border-[#A60321]')
                                        } ${isLoadingAppointments ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    <option value="" disabled>
                                        {isLoadingAppointments ? 'Carregando consultas...' : 'Selecione uma consulta da lista...'}
                                    </option>

                                    {appointments.map((app) => (
                                        <option key={app.id} value={app.id}>
                                            id_consulta:{app.id} - {app.client?.fullname || 'Cliente não identificado'}
                                        </option>
                                    ))}
                                </select>

                                {isLoadingAppointments && (
                                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-[#A60321]" />
                                )}
                            </div>

                            {validationErrors.appointment && (
                                <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {validationErrors.appointment}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'
                                }`}>
                                Descrição do Prontuário <span className="text-[#A60321]">*</span>
                            </label>

                            <textarea
                                id="description"
                                rows="8"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Descreva os detalhes clínicos da sessão, observações, evolução do paciente..."
                                className={`resize-y min-h-[160px] ${inputBaseStyles} ${validationErrors.description
                                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                                    : (isDarkMode ? 'border-gray-700 focus:ring-[#A60321]/20 focus:border-[#A60321]' : 'border-[#8C5C32]/30 focus:ring-[#A60321]/20 focus:border-[#A60321]')
                                    }`}
                            />

                            <div className="flex justify-between items-start">
                                {validationErrors.description ? (
                                    <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {validationErrors.description}
                                    </p>
                                ) : (
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Mínimo de 10 caracteres.
                                    </p>
                                )}
                                <span className={`text-xs font-medium ${description.length < 10
                                    ? 'text-red-500'
                                    : (isDarkMode ? 'text-green-400' : 'text-green-600')
                                    }`}>
                                    {description.length} caracteres
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-end border-t border-dashed transition-colors duration-300 ${
                            isDarkMode ? 'border-gray-800' : 'border-[#8C5C32]/20'
                        }">
                            <button
                                type="button"
                                onClick={() => navigate('/psych-history')}
                                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 w-full sm:w-auto ${isDarkMode
                                    ? 'bg-transparent text-gray-300 hover:bg-white/5'
                                    : 'bg-transparent text-[#4A2E14] hover:bg-[#8C5C32]/10'
                                    }`}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting || isLoadingAppointments}
                                className={`px-8 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto
                                    ${isSubmitting || isLoadingAppointments
                                        ? 'bg-[#A60321]/70 cursor-not-allowed'
                                        : 'bg-[#A60321] hover:bg-[#8a021b] hover:shadow-lg hover:-translate-y-0.5'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Criar Prontuário
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
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
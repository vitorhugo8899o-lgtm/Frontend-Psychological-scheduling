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
    Clock,
    Search,
    User,
    Calendar,
    FileText
} from 'lucide-react';
import { Logout } from '../servicies/Users';
import { GetHistoryAppoiment, GetUserRecords } from '../servicies/Psych';
import { useNavigate } from "react-router-dom";
import SidebarButton from '../componentes/SidebarButton';
import { useTheme } from '../context/ThemeContext';

export default function ClientRecordList() {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [clients, setClients] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [isLoadingClients, setIsLoadingClients] = useState(true);

    const [records, setRecords] = useState([]);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const [apiError, setApiError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchClientsData() {
            try {
                setIsLoadingClients(true);
                setApiError(null);
                const response = await GetHistoryAppoiment();

                if (!isMounted) return;

                let data;
                if (response && typeof response.json === 'function') {
                    data = await response.json();
                } else {
                    data = response;
                }

                const appointmentsArray = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);

                const uniqueClientsMap = new Map();
                appointmentsArray.forEach(app => {
                    if (app.client && app.client.id) {
                        uniqueClientsMap.set(app.client.id, app.client);
                    }
                });

                setClients(Array.from(uniqueClientsMap.values()));
            } catch (error) {
                if (isMounted) {
                    console.error("Erro ao carregar lista de clientes:", error);
                    setApiError("Não foi possível carregar a lista de clientes. Tente recarregar a página.");
                }
            } finally {
                if (isMounted) {
                    setIsLoadingClients(false);
                }
            }
        }

        fetchClientsData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!selectedClientId) return;

        try {
            setRecords([]);
            setApiError(null);
            setIsLoadingRecords(true);
            setSearchPerformed(true);

            const response = await GetUserRecords(Number(selectedClientId));

            let data;
            if (response && typeof response.json === 'function') {
                data = await response.json();
            } else {
                data = response;
            }

            if (Array.isArray(data)) {
                setRecords(data);
            } else if (data && Array.isArray(data.data)) {
                setRecords(data.data);
            } else {
                setRecords([]);
            }
        } catch (error) {
            console.error("Erro ao buscar prontuários do cliente:", error);
            setApiError(error.message || "Ocorreu um erro ao buscar os prontuários deste cliente.");
        } finally {
            setIsLoadingRecords(false);
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

    const SkeletonRecordCard = () => (
        <div className={`p-6 rounded-2xl border animate-pulse ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 space-y-2">
                    <div className={`h-5 rounded w-1/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className={`h-3 rounded w-1/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
                <div className={`h-4 rounded w-20 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
            <div className="space-y-2 pt-2 border-t border-dashed border-gray-700/20">
                <div className={`h-3 rounded w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-3 rounded w-5/6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
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
                <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={() => setIsMenuOpen(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col py-8 border-r transition-transform duration-300 transform h-full
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'}
            }`}>
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
                    />

                    <SidebarButton
                        icon={BookMarked}
                        label="Crie um Prontuário."
                        to='/create-record'
                    />

                    <SidebarButton
                        icon={BookKey}
                        label="Busque um prontuário de um usuário."
                        to='/record-user'
                        isActive
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

            <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-5xl mx-auto w-full overflow-y-auto">
                <header className="mb-8 md:mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-2">
                        <BookKey className="w-7 h-7 md:w-8 md:h-8 text-[#A60321]" />
                        <h1 className={`text-2xl md:text-3xl font-medium ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                            Busca de Prontuário por Cliente
                        </h1>
                    </div>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                        Selecione um paciente para listar e auditar seu histórico completo de prontuários clínicos.
                    </p>
                </header>

                <form
                    onSubmit={handleSearch}
                    className={`p-6 rounded-2xl border mb-8 transition-all duration-300 shadow-sm animate-fade-in-up ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                        }`}
                    style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}
                >
                    <div className="flex flex-col sm:flex-row items-end gap-4">
                        <div className="flex-1 w-full space-y-2">
                            <label htmlFor="client-select" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                Selecione o Cliente <span className="text-[#A60321]">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="client-select"
                                    value={selectedClientId}
                                    onChange={(e) => setSelectedClientId(e.target.value)}
                                    disabled={isLoadingClients}
                                    className={`w-full rounded-xl p-4 pr-10 text-sm outline-none transition-all duration-300 border appearance-none cursor-pointer focus:ring-2 focus:ring-[#A60321]/20 focus:border-[#A60321] ${isDarkMode
                                        ? 'bg-[#131c2e] text-gray-100 border-gray-700 placeholder-gray-500'
                                        : 'bg-[#FAF5EC]/50 text-[#4A2E14] border-[#8C5C32]/30 placeholder-[#8C5C32]/60'
                                        } ${isLoadingClients ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    <option value="" disabled>
                                        {isLoadingClients ? 'Carregando pacientes disponíveis...' : 'Escolha um paciente da lista...'}
                                    </option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.fullname}
                                        </option>
                                    ))}
                                </select>
                                {isLoadingClients && (
                                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-[#A60321]" />
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoadingRecords || !selectedClientId}
                            className={`w-full sm:w-auto px-6 py-4 rounded-xl font-semibold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 shrink-0
                                ${isLoadingRecords || !selectedClientId
                                    ? 'bg-[#A60321]/50 cursor-not-allowed'
                                    : 'bg-[#A60321] hover:bg-[#8a021b] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                                }`}
                        >
                            {isLoadingRecords ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            Buscar Prontuários
                        </button>
                    </div>
                </form>

                {apiError && (
                    <div className="flex items-start gap-3 p-5 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 animate-fade-in-up">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-red-500">{apiError}</span>
                    </div>
                )}

                <div className="space-y-5">
                    {isLoadingRecords && [1, 2].map(i => <SkeletonRecordCard key={i} />)}

                    {!isLoadingRecords && !searchPerformed && !apiError && (
                        <div className={`text-center py-16 rounded-2xl border border-dashed ${isDarkMode ? 'border-gray-800' : 'border-[#8C5C32]/25'}`}>
                            <User className={`w-12 h-12 mx-auto mb-3 opacity-30 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`} />
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]/80'}`}>
                                Selecione um paciente acima e clique em buscar para listar seu histórico médico.
                            </p>
                        </div>
                    )}

                    {!isLoadingRecords && searchPerformed && !apiError && records.length === 0 && (
                        <div className={`text-center py-16 rounded-2xl border ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-white border-[#8C5C32]/15'}`}>
                            <FileText className={`w-14 h-14 mx-auto mb-4 opacity-25 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`} />
                            <p className={`text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                Nenhum prontuário registrado.
                            </p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]/70'}`}>
                                Este paciente não possui nenhuma evolução ou prontuário anexado ao sistema até o momento.
                            </p>
                        </div>
                    )}

                    {!isLoadingRecords && searchPerformed && !apiError && records.length > 0 && (
                        records.map((record, index) => (
                            <div
                                key={record.id}
                                className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-md animate-fade-in-up ${isDarkMode
                                    ? 'bg-[#090d16] border-gray-800 hover:border-[#A60321]/30'
                                    : 'bg-white border-[#8C5C32]/15 hover:border-[#8C5C32]/40'
                                    }`}
                                style={{
                                    animationDelay: `${index * 80}ms`,
                                    animationFillMode: 'backwards'
                                }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                                    <div>
                                        <h3 className={`text-base font-bold tracking-wide ${isDarkMode ? 'text-gray-100' : 'text-[#4A2E14]'}`}>
                                            {record.service_name || "Serviço Não Especificado"}
                                        </h3>
                                        <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                                            Psicólogo(a): <span className="font-semibold">{record.psych_fullname || "Profissional"}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                                        <Calendar className="w-3.5 h-3.5 text-[#A60321]" />
                                        <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                            {record.format_date_br || "Data Indisponível"}
                                        </span>
                                    </div>
                                </div>

                                <div className={`pt-3 border-t border-dashed text-sm leading-relaxed whitespace-pre-line ${isDarkMode ? 'border-gray-800 text-gray-300' : 'border-gray-100 text-gray-700'
                                    }`}>
                                    {record.description}
                                </div>
                            </div>
                        ))
                    )}
                </div>
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

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}
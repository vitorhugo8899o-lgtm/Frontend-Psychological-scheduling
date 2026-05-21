import React, { useState } from 'react';
import {
    Heart,
    Home,
    CalendarPlus,
    Settings,
    LogOut,
    Menu,
    X,
    AlertCircle,
    Calendar,
    Sun,
    Moon,
    Users,
    Mail,
    Shield,
    ClipboardListIcon,
    Search,
    UserLock,
    Brain,
    Banknote
} from 'lucide-react';
import { Logout, GetUser } from '../servicies/Users';
import { useNavigate } from "react-router-dom";
import SidebarButton from '../componentes/SidebarButton';
import { useTheme } from '../context/ThemeContext';

export default function UserInfo() {
    const { isDarkMode, toggleTheme } = useTheme();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [validationError, setValidationError] = useState('');

    const navigate = useNavigate();

    const roleConfig = {
        admin: {
            label: 'Administrador',
            className: 'bg-red-500/10 text-red-500 border border-red-500/20'
        },
        psychologist: {
            label: 'Psicólogo',
            className: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
        },
        patient: {
            label: 'Paciente',
            className: 'bg-green-500/10 text-green-500 border border-green-500/20'
        },
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        setUser(null);
        setApiError(null);
        setValidationError('');

        if (!userId.trim()) {
            setValidationError('Por favor, insira um ID.');
            return;
        }

        if (isNaN(userId) || Number(userId) <= 0) {
            setValidationError('Por favor, insira um ID numérico válido.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await GetUser(userId);

            let data;
            if (response && typeof response.json === 'function') {
                data = await response.json();
            } else {
                data = response;
            }

            const userData = data?.data || data;

            if (userData && userData.id !== undefined) {
                setUser(userData);
            } else {
                setApiError('Usuário não encontrado com o ID fornecido.');
            }
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            setApiError(error.message || "Não foi possível carregar os dados do usuário.");
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

    const formatDate = (dateString) => {
        if (!dateString) return "Data não disponível";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch (e) {
            return dateString;
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
                <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={() => setIsMenuOpen(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col py-8 border-r transition-transform duration-300 transform h-full ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'
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
                    <nav className="flex-1 py-8 flex flex-col gap-1 overflow-y-auto">
                        <SidebarButton
                            icon={Home}
                            label="Início"
                            to="/home-adm"
                        />

                        <SidebarButton
                            icon={ClipboardListIcon}
                            label="Lista de usuário registrados."
                            to='/users-list'
                        />

                        <SidebarButton
                            icon={UserLock}
                            label="Busque um usuário em especifico."
                            to='/user-info'
                            isActive
                        />

                        <SidebarButton
                            icon={Brain}
                            label="Adicionar psicólogo no sistema."
                            to='/add-psych'
                        />

                        <SidebarButton
                            icon={CalendarPlus}
                            label="Adicionar um serviço."
                            to='/create-service'
                        />

                        <SidebarButton
                            icon={Banknote}
                            label="Relátorio Financeiro."
                            to='/financial-report'
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
                </nav>
            </aside>

            <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-4xl mx-auto w-full overflow-y-auto">
                <header className="mb-8 md:mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Search className="w-7 h-7 md:w-8 md:h-8 text-[#A60321]" />
                        <h1 className={`text-2xl md:text-3xl font-medium ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                            Buscar Usuário
                        </h1>
                    </div>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                        Insira o ID de registro para localizar um usuário específico.
                    </p>
                </header>

                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Digite o ID do usuário (Ex: 12)"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className={`w-full px-5 py-3.5 rounded-xl border outline-none transition-all duration-300 ${isDarkMode
                                    ? 'bg-[#131c2e] border-gray-800 text-white focus:border-[#A60321]'
                                    : 'bg-white border-[#8C5C32]/30 text-gray-800 focus:border-[#4A2E14]'
                                    }`}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shrink-0 ${isDarkMode
                                ? 'bg-[#A60321] text-white hover:bg-[#85021a]'
                                : 'bg-[#4A2E14] text-[#FAF5EC] hover:bg-[#36210e]'
                                } disabled:opacity-50`}
                        >
                            {isLoading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>

                    {validationError && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {validationError}
                        </p>
                    )}
                </form>

                {isLoading && (
                    <div className={`p-6 rounded-2xl border animate-pulse ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <div className={`h-5 rounded w-1/2 mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                <div className={`h-4 rounded w-1/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <div className={`h-3 rounded w-1/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        </div>
                    </div>
                )}

                {!isLoading && apiError && (
                    <div className="flex items-start gap-3 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 animate-fade-in">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-red-500">Erro na busca</span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{apiError}</span>
                        </div>
                    </div>
                )}

                {!isLoading && user && (() => {
                    const roleInfo = roleConfig[user.role?.toLowerCase()] || {
                        label: user.role || 'Usuário',
                        className: 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                    };

                    return (
                        <div className={`p-6 rounded-2xl border transition-all duration-300 shadow-lg relative overflow-hidden animate-fade-in-up ${isDarkMode ? 'bg-[#131c2e] border-[#A60321]/40' : 'bg-white border-[#8C5C32]/30'
                            }`}>
                            <Heart className="absolute top-4 right-4 w-8 h-8 opacity-5 text-[#A60321]" fill="currentColor" />

                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 relative z-10">
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h3 className={`text-xl font-semibold tracking-wide ${isDarkMode ? 'text-gray-100' : 'text-[#4A2E14]'}`}>
                                            {user.fullname || "Nome não informado"}
                                        </h3>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-[#A60321] opacity-70" />
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>{user.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-[#A60321] opacity-70" />
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                                                ID de Registro: {user.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-[#A60321]" />
                                        <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>
                                            Criado em: {formatDate(user.created_at)}
                                        </span>
                                    </div>

                                    <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider ${roleInfo.className}`}>
                                        {roleInfo.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })()}
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
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
}
import React, { useState } from 'react';
import {
    Heart,
    Home,
    CalendarPlus,
    Search,
    Settings,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    UserPlus,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ClipboardListIcon,
    UserLock,
    Brain,
    Banknote
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import SidebarButton from '../componentes/SidebarButton';
import { useTheme } from '../context/ThemeContext';
import { Logout } from '../servicies/Users';
import { CreatePsych } from '../servicies/Psych';
export default function AddPsych() {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [region, setRegion] = useState('');
    const [number, setNumber] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Por favor, insira um endereço de e-mail válido.";
        }

        const regionNum = parseInt(region, 10);
        if (isNaN(regionNum) || regionNum < 1 || regionNum > 24) {
            return "A região do CRP deve ser um número válido entre 1 e 24.";
        }

        const numberRegex = /^\d{1,6}$/;
        if (!numberRegex.test(number)) {
            return "O número do CRP deve conter apenas de 1 a 6 dígitos numéricos.";
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        try {
            await CreatePsych({ email, region, number });

            setSuccess("Psicólogo adicionado com sucesso!");
            setEmail('');
            setRegion('');
            setNumber('');
        } catch (err) {
            setError(err.message || "Erro ao cadastrar psicólogo. Verifique os dados e tente novamente.");
        } finally {
            setIsLoading(false);
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
                    />

                    <SidebarButton
                        icon={Brain}
                        label="Adicionar psicólogo no sistema."
                        to='/add-psych'
                        isActive
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
            </aside>

            <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-3xl mx-auto w-full overflow-y-auto">
                <header className="mb-8 md:mb-10">
                    <h1 className={`text-2xl md:text-3xl font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                        Adicionar Psicólogo
                    </h1>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                        Conceda credenciais de psicólogo para um usuário já cadastrado.
                    </p>
                </header>

                <div className={`p-6 md:p-8 rounded-2xl border ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15 shadow-sm'}`}>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        <div className="flex flex-col gap-1.5">
                            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                E-mail do Usuário
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="usuario@exemplo.com"
                                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#A60321]/50 transition-all ${isDarkMode
                                    ? 'bg-[#0f172a] border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-[#FAF5EC]/50 border-gray-200 text-gray-900 placeholder-gray-400'
                                    }`}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Região do CRP (1 a 24)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="24"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    placeholder="Ex: 6"
                                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#A60321]/50 transition-all ${isDarkMode
                                        ? 'bg-[#0f172a] border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-[#FAF5EC]/50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        }`}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Número do CRP (até 6 dígitos)
                                </label>
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Ex: 123456"
                                    className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#A60321]/50 transition-all ${isDarkMode
                                        ? 'bg-[#0f172a] border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-[#FAF5EC]/50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        }`}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#A60321] hover:bg-[#8a021b] text-white p-3.5 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Cadastrar Psicólogo
                                </>
                            )}
                        </button>
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
        </div>
    );
}
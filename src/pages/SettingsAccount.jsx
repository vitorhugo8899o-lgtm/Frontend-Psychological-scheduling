import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Settings,
    AlertTriangle,
    Shield,
    Loader2,
    X,
    Eye,
    EyeOff,
    Heart,
    Menu,
    Home,
    CalendarPlus,
    Search,
    ClipboardList,
    LogOut,
    FolderOpen
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { UpdateUserInfo, DesactiveAccount, Logout } from '../servicies/Users';
import SidebarButton from '../componentes/SidebarButton';

export default function AccountSettings() {
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const cardBaseClass = `p-6 md:p-8 rounded-2xl border transition-colors duration-300 shadow-sm ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
        }`;

    const inputBaseClass = `w-full px-4 py-2.5 mt-1 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${isDarkMode
        ? 'bg-[#090d16] border-gray-700 focus:border-orange-500 focus:ring-orange-500/20 text-gray-200 placeholder-gray-500'
        : 'bg-[#FAF5EC]/50 border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 text-gray-800 placeholder-gray-400'
        }`;

    const labelBaseClass = `block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`;

    const sendPrompt = (text) => {
        console.log(`Prompt enviado: ${text}`);
    };

    const handleMenuClick = (text) => {
        if (text) sendPrompt(text);
        setIsMenuOpen(false);
    };

    const LogoutUser = async (e) => {
        if (e) e.preventDefault();
        const confirmLogout = window.confirm('Você realmente deseja sair da sua conta?');
        if (!confirmLogout) return;

        try {
            await Logout();
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Erro ao realizar logout:', error);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setUpdateError('');

        if (newPassword && newPassword !== confirmPassword) {
            setUpdateError('A nova senha e a confirmação não coincidem.');
            return;
        }

        if (!email && !newPassword) {
            setUpdateError('Preencha pelo menos um campo para atualizar.');
            return;
        }

        try {
            setIsLoadingUpdate(true);

            await UpdateUserInfo({
                email: email || undefined,
                password: newPassword || undefined
            });
            alert("Redirecionando para tela inicial....")
            navigate('/', { replace: true });

        } catch (error) {
            setUpdateError(error.message || 'Erro ao atualizar as informações.');
        } finally {
            setIsLoadingUpdate(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setIsLoadingDelete(true);
            await DesactiveAccount();
            alert("Redirecionando para tela inicial....")
            navigate('/', { replace: true });
        } catch (error) {
            alert(error.message || 'Ocorreu um erro ao tentar desativar sua conta.');
        } finally {
            setIsLoadingDelete(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className={`min-h-screen w-full flex flex-col transition-colors duration-300 overflow-hidden ${isDarkMode ? 'bg-[#0f172a] text-gray-100' : 'bg-[#FAF5EC] text-gray-800'}`}>

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
            `}>
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
                        icon={FolderOpen}
                        label="Consultas em progresso"
                        to="/appoiments/in-progress"
                    />

                    <SidebarButton
                        icon={CalendarPlus}
                        label="Marcar consulta"
                        to='/appoiment'
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
                        isActive
                    />

                    <SidebarButton
                        icon={LogOut}
                        label="Sair"
                        onClick={LogoutUser}
                    />
                </nav>
            </aside>

            <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-4xl mx-auto w-full overflow-y-auto">
                <header className="mb-8 md:mb-10">
                    <h1 className={`text-2xl md:text-3xl font-medium mb-2 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                        <Settings className="w-8 h-8 text-[#A60321]" />
                        Configurações da Conta
                    </h1>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                        Gerencie suas credenciais de acesso ou desative sua conta.
                    </p>
                </header>

                <section className={`${cardBaseClass} border-l-4 border-l-orange-500 mb-8`}>
                    <div className="flex items-center gap-2 mb-6">
                        <Shield className="w-6 h-6 text-orange-500" />
                        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-[#4A2E14]'}`}>
                            Atualização de Credenciais
                        </h2>
                    </div>

                    <form onSubmit={handleUpdateSubmit} className="space-y-6">
                        <div>
                            <label className={labelBaseClass}>Novo Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu.novo.email@exemplo.com"
                                className={inputBaseClass}
                            />
                        </div>

                        <hr className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`} />

                        <div className="space-y-4">
                            <div>
                                <label className={labelBaseClass}>Senha Atual</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={inputBaseClass}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelBaseClass}>Nova Senha</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={inputBaseClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelBaseClass}>Confirmar Nova Senha</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={inputBaseClass}
                                    />
                                </div>
                            </div>
                        </div>

                        {updateError && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <span className="text-sm font-medium text-red-500">{updateError}</span>
                            </div>
                        )}

                        <div className={`flex items-start gap-3 p-4 rounded-xl border ${isDarkMode
                            ? 'bg-orange-500/10 border-orange-500/20'
                            : 'bg-orange-50 border-orange-200'
                            }`}>
                            <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                            <div className="flex flex-col">
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>
                                    Atenção
                                </span>
                                <span className={`text-sm mt-1 ${isDarkMode ? 'text-orange-200/70' : 'text-orange-600/80'}`}>
                                    Após alterar o email ou senha, você será deslogado automaticamente e precisará realizar login novamente. Não será possível retornar para as credenciais anteriores.
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isLoadingUpdate}
                                className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2
                                    ${isLoadingUpdate ? 'bg-orange-500/70 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 hover:-translate-y-0.5 shadow-lg shadow-orange-500/20'}
                                `}
                            >
                                {isLoadingUpdate ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    'Salvar Alterações'
                                )}
                            </button>
                        </div>
                    </form>
                </section>

                <section className={`${cardBaseClass} border-l-4 border-l-red-500`}>
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <h2 className="text-xl font-semibold text-red-500">
                            Zona de Perigo
                        </h2>
                    </div>

                    <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Ao desativar sua conta, você perderá acesso imediato ao sistema e seu histórico ficará indisponível. Esta ação deve ser tratada com cuidado.
                    </p>

                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-6 py-3 rounded-lg font-medium text-red-500 bg-red-500/10 border border-red-500/20 transition-all duration-200 hover:bg-red-500 hover:text-white"
                    >
                        Desativar minha conta
                    </button>
                </section>
            </main>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => !isLoadingDelete && setIsDeleteModalOpen(false)}
                    />

                    <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl transition-all transform scale-100 ${isDarkMode ? 'bg-[#0f172a] border border-gray-800' : 'bg-[#FAF5EC]'
                        }`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3 text-red-500">
                                <div className="p-2 bg-red-500/10 rounded-full">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold">Desativar Conta</h3>
                            </div>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isLoadingDelete}
                                className={`p-1 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-200'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Você está prestes a desativar sua conta na Clínica Equilíbrio Mental. Você tem certeza de que deseja prosseguir?
                        </p>

                        <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span className="text-sm font-semibold text-red-500">
                                Esta ação é permanente e não poderá ser revertida após a confirmação.
                            </span>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isLoadingDelete}
                                className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${isDarkMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isLoadingDelete}
                                className={`px-5 py-2.5 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${isLoadingDelete ? 'bg-red-500/70 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20'
                                    }`}
                            >
                                {isLoadingDelete ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Desativando...
                                    </>
                                ) : (
                                    'Sim, desativar conta'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
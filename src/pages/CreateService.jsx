import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Heart,
    Home,
    CalendarPlus,
    Menu,
    X,
    LogOut,
    Loader2,
    AlertCircle,
    CheckCircle,
    Save,
    ArrowLeft,
    Settings,
    ClipboardListIcon,
    UserLock,
    Brain
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CreateService } from '../servicies/Services';
import { Logout } from '../servicies/Users';
import SidebarButton from '../componentes/SidebarButton';

export default function CreateServicePage() {
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration_minutes: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [statusFeedback, setStatusFeedback] = useState({ type: '', message: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name || formData.name.trim().length < 7) {
            newErrors.name = "O nome é obrigatório e deve ter no mínimo 7 caracteres.";
        }

        if (!formData.description || formData.description.trim().length < 10) {
            newErrors.description = "A descrição é obrigatória e deve ter no mínimo 10 caracteres.";
        }

        const priceValue = parseFloat(formData.price);
        if (!formData.price || isNaN(priceValue) || priceValue < 0) {
            newErrors.price = "O preço é obrigatório e não pode ser negativo.";
        }

        const durationValue = parseInt(formData.duration_minutes, 10);
        if (!formData.duration_minutes || isNaN(durationValue) || durationValue < 30) {
            newErrors.duration_minutes = "A duração é obrigatória e deve ser de no mínimo 30 minutos.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusFeedback({ type: '', message: '' });

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await CreateService({
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                duration_minutes: parseInt(formData.duration_minutes, 10)
            });

            setStatusFeedback({
                type: 'success',
                message: 'Serviço cadastrado com sucesso!'
            });

            setFormData({
                name: '',
                description: '',
                price: '',
                duration_minutes: ''
            });

        } catch (error) {
            setStatusFeedback({
                type: 'error',
                message: error.message || 'Erro ao cadastrar serviço. Tente novamente.'
            });
        } finally {
            setIsLoading(false);
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
                    />

                    <SidebarButton
                        icon={CalendarPlus}
                        label="Adicionar um serviço."
                        to='/create-service'
                        isActive
                    />

                    <SidebarButton
                        icon={CalendarPlus}
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
                <header className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-[#4A2E14]/10'
                            }`}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className={`text-2xl md:text-3xl font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'
                            }`}>
                            Cadastrar Novo Serviço
                        </h1>
                        <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'
                            }`}>
                            Preencha as informações abaixo para adicionar um serviço ao sistema.
                        </p>
                    </div>
                </header>

                {statusFeedback.message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 mb-6 border ${statusFeedback.type === 'error'
                        ? (isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600')
                        : (isDarkMode ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-50 border-green-200 text-green-600')
                        }`}>
                        {statusFeedback.type === 'error' ? (
                            <AlertCircle className="w-5 h-5 shrink-0" />
                        ) : (
                            <CheckCircle className="w-5 h-5 shrink-0" />
                        )}
                        <span className="text-sm font-medium">{statusFeedback.message}</span>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className={`p-6 md:p-8 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                        }`}
                >
                    <div className="space-y-6">

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                Nome do Serviço *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Ex: Terapia Cognitivo-Comportamental"
                                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#A60321] transition-colors ${isDarkMode
                                    ? 'bg-[#0f172a] border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-[#FAF5EC]/50 border-[#8C5C32]/30 text-gray-900 placeholder-gray-400'
                                    } ${errors.name ? '!border-red-500 focus:!ring-red-500' : ''}`}
                            />
                            {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                Descrição *
                            </label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Descreva os detalhes do serviço..."
                                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#A60321] transition-colors resize-y ${isDarkMode
                                    ? 'bg-[#0f172a] border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-[#FAF5EC]/50 border-[#8C5C32]/30 text-gray-900 placeholder-gray-400'
                                    } ${errors.description ? '!border-red-500 focus:!ring-red-500' : ''}`}
                            />
                            {errors.description && <p className="mt-1.5 text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                    Preço (R$) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#A60321] transition-colors ${isDarkMode
                                        ? 'bg-[#0f172a] border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-[#FAF5EC]/50 border-[#8C5C32]/30 text-gray-900 placeholder-gray-400'
                                        } ${errors.price ? '!border-red-500 focus:!ring-red-500' : ''}`}
                                />
                                {errors.price && <p className="mt-1.5 text-sm text-red-500">{errors.price}</p>}
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                    Duração (minutos) *
                                </label>
                                <input
                                    type="number"
                                    name="duration_minutes"
                                    step="1"
                                    min="30"
                                    value={formData.duration_minutes}
                                    onChange={handleInputChange}
                                    placeholder="Ex: 50"
                                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#A60321] transition-colors ${isDarkMode
                                        ? 'bg-[#0f172a] border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-[#FAF5EC]/50 border-[#8C5C32]/30 text-gray-900 placeholder-gray-400'
                                        } ${errors.duration_minutes ? '!border-red-500 focus:!ring-red-500' : ''}`}
                                />
                                {errors.duration_minutes && <p className="mt-1.5 text-sm text-red-500">{errors.duration_minutes}</p>}
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 ${isLoading
                                ? 'bg-[#A60321]/70 cursor-not-allowed'
                                : 'bg-[#A60321] hover:bg-[#85021a] active:scale-95 shadow-md hover:shadow-lg'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Salvar Serviço
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
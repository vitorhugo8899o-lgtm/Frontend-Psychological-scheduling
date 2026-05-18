import React, { useState } from 'react';
import {
    Heart,
    Home,
    CalendarPlus,
    Search,
    ClipboardList,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    Loader2,
    AlertCircle,
    DollarSign,
    Clock,
    FileText,
    SlidersHorizontal,
    Settings
} from 'lucide-react';
import { Logout } from '../servicies/Users';
import { SearchService } from '../servicies/Services';
import { useNavigate } from "react-router-dom";
import SidebarButton from '../componentes/SidebarButton';

import { useTheme } from '../context/ThemeContext';

export default function SearchServices() {
    const { isDarkMode, toggleTheme } = useTheme();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        duration_minutes: '',
        offset: '0',
        limit: '10',
        option: 'and'
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (formData.name && formData.name.trim().length < 7) {
            newErrors.name = 'O nome do serviço deve possuir no mínimo 7 caracteres.';
        }

        if (formData.duration_minutes) {
            const duration = Number(formData.duration_minutes);
            if (!Number.isInteger(duration) || duration < 0) {
                newErrors.duration_minutes = 'A duração deve ser um número inteiro positivo.';
            }
        }

        if (formData.price) {
            const price = Number(formData.price);
            if (isNaN(price) || price < 0) {
                newErrors.price = 'O preço não pode ser negativo e deve ser um valor decimal válido.';
            }
        }

        if (formData.offset) {
            const offset = Number(formData.offset);
            if (!Number.isInteger(offset) || offset < 0) {
                newErrors.offset = 'O offset deve ser um número inteiro positivo.';
            }
        }

        if (formData.limit) {
            const limit = Number(formData.limit);
            if (!Number.isInteger(limit) || limit < 0) {
                newErrors.limit = 'O limite deve ser um número inteiro positivo.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setApiError(null);
        setResults([]);

        if (!validateForm()) return;

        try {
            setIsLoading(true);
            setHasSearched(true);

            const payload = {
                offset: formData.offset ? parseInt(formData.offset, 10) : 0,
                limit: formData.limit ? parseInt(formData.limit, 10) : 5,
                option: formData.option
            };

            if (formData.name.trim()) payload.name = formData.name.trim();
            if (formData.price) payload.price = parseFloat(formData.price);
            if (formData.duration_minutes) payload.duration_minutes = parseInt(formData.duration_minutes, 10);

            const response = await SearchService(payload);

            let data;
            if (response && typeof response.json === 'function') {
                data = await response.json();
            } else {
                data = response;
            }

            if (Array.isArray(data)) {
                setResults(data);
            } else if (data && Array.isArray(data.data)) {
                setResults(data.data);
            } else {
                setResults([]);
            }

        } catch (error) {
            console.error("Erro ao filtrar serviços:", error);
            setApiError(error.message || "Não foi possível realizar a busca.");
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const sendPrompt = (text) => console.log(`Prompt enviado: ${text}`);

    const handleMenuClick = (text) => {
        if (text) sendPrompt(text);
        setIsMenuOpen(false);
    };

    const LogoutUser = async (e) => {
        e.preventDefault();
        if (!window.confirm('Você realmente deseja sair da sua conta?')) return;
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
                <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={() => setIsMenuOpen(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col py-8 border-r transition-transform duration-300 transform h-full ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'
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
                        isActive
                    />
                    <SidebarButton
                        icon={ClipboardList}
                        label="Minhas consultas"
                        onClick={() => handleMenuClick('Ver minhas consultas agendadas')}
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

            <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full overflow-y-auto">
                <header className="mb-8 md:mb-10">
                    <h1 className={`text-2xl md:text-3xl font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                        Busca Avançada de Serviços
                    </h1>
                    <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                        Filtre as modalidades de atendimento de acordo com a sua necessidade.
                    </p>
                </header>

                <section className={`p-6 rounded-2xl border mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                    }`}>
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                            <div className="flex flex-col gap-1.5 md:col-span-3">
                                <label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                    Nome do Serviço
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Ex: Terapia Cognitiva Comportamental"
                                        className={`w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border transition-all outline-none ${isDarkMode
                                            ? 'bg-[#0f172a] border-gray-700 text-white focus:border-[#A60321]'
                                            : 'bg-[#FAF5EC]/50 border-[#8C5C32]/30 text-gray-800 focus:border-[#A60321]'
                                            } ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.name && <span className="text-red-500 text-xs mt-0.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                    Preço Máximo (R$)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="Ex: 150.50"
                                        className={`w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border transition-all outline-none ${isDarkMode
                                            ? 'bg-[#0f172a] border-gray-700 text-white focus:border-[#A60321]'
                                            : 'bg-[#FAF5EC]/50 border-[#8C5C32]/30 text-gray-800 focus:border-[#A60321]'
                                            } ${errors.price ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.price && <span className="text-red-500 text-xs mt-0.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.price}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                    Duração (minutos)
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        name="duration_minutes"
                                        value={formData.duration_minutes}
                                        onChange={handleChange}
                                        placeholder="Ex: 60"
                                        className={`w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border transition-all outline-none ${isDarkMode
                                            ? 'bg-[#0f172a] border-gray-700 text-white focus:border-[#A60321]'
                                            : 'bg-[#FAF5EC]/50 border-[#8C5C32]/30 text-gray-800 focus:border-[#A60321]'
                                            } ${errors.duration_minutes ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.duration_minutes && <span className="text-red-500 text-xs mt-0.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.duration_minutes}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                                    Lógica do Filtro
                                </label>
                                <div className="relative">
                                    <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    <select
                                        name="option"
                                        value={formData.option}
                                        onChange={handleChange}
                                        className={`w-full text-sm pl-10 pr-10 py-2.5 rounded-xl border transition-all outline-none appearance-none cursor-pointer ${isDarkMode
                                            ? 'bg-[#0f172a] border-gray-700 text-white focus:border-[#A60321]'
                                            : 'bg-[#FAF5EC]/50 border-[#8C5C32]/30 text-gray-800 focus:border-[#A60321]'
                                            }`}
                                    >
                                        <option value="and">E (Corresponder a todos os critérios)</option>
                                        <option value="or">OU (Corresponder a qualquer critério)</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400 w-0 h-0" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 md:col-span-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className={`text-[11px] font-semibold ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>Offset</label>
                                    <input
                                        type="number"
                                        name="offset"
                                        value={formData.offset}
                                        onChange={handleChange}
                                        className={`w-full text-xs px-3 py-2.5 rounded-xl border transition-all outline-none ${isDarkMode ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-[#FAF5EC]/50 border-[#8C5C32]/30 text-gray-800'
                                            }`}
                                    />
                                    {errors.offset && <span className="text-red-500 text-[10px]">{errors.offset}</span>}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className={`text-[11px] font-semibold ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>Limite</label>
                                    <input
                                        type="number"
                                        name="limit"
                                        value={formData.limit}
                                        onChange={handleChange}
                                        className={`w-full text-xs px-3 py-2.5 rounded-xl border transition-all outline-none ${isDarkMode ? 'bg-[#0f172a] border-gray-700 text-white' : 'bg-[#FAF5EC]/50 border-[#8C5C32]/30 text-gray-800'
                                            }`}
                                    />
                                    {errors.limit && <span className="text-red-500 text-[10px]">{errors.limit}</span>}
                                </div>
                            </div>

                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-sm text-[#FAF5EC] bg-[#A60321] hover:bg-[#85021a] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Buscando...
                                    </>
                                ) : (
                                    <>
                                        <SlidersHorizontal className="w-4 h-4" />
                                        Aplicar Filtros
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>

                <section className={`p-6 rounded-2xl border transition-colors duration-300 ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'
                    }`}>
                    <h2 className={`text-lg font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>
                        <FileText className="w-5 h-5 text-[#A60321]" />
                        Resultados da Busca
                    </h2>

                    {apiError && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 my-2">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-red-500">Erro na requisição</span>
                                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{apiError}</span>
                            </div>
                        </div>
                    )}

                    {!isLoading && results.length === 0 && hasSearched && !apiError && (
                        <div className="text-center py-10">
                            <Search className={`w-10 h-10 mx-auto mb-3 opacity-40 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`} />
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>Nenhum serviço correspondente encontrado.</p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]/70'}`}>Tente flexibilizar os termos ou valores informados nos campos acima.</p>
                        </div>
                    )}

                    {!isLoading && !hasSearched && (
                        <div className="text-center py-10">
                            <SlidersHorizontal className={`w-10 h-10 mx-auto mb-3 opacity-30 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`} />
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]/70'}`}>Preencha os filtros desejados e clique em aplicar.</p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="divide-y divide-gray-800/10 dark:divide-gray-800">
                            {results.map((service) => (
                                <div key={service.id || service.name} className="py-5 first:pt-0 last:pb-0 flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                        <div>
                                            <h4 className={`text-sm font-semibold tracking-wide ${isDarkMode ? 'text-gray-200' : 'text-[#4A2E14]'}`}>
                                                {service.name}
                                            </h4>
                                            <p className={`text-xs font-medium mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                                                {service.description || "Sem descrição disponível."}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 sm:flex-col sm:items-end shrink-0">
                                            <span className="text-sm font-bold text-[#A60321]">
                                                {service.price ? `R$ ${parseFloat(service.price).toFixed(2)}` : 'Preço sob consulta'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                                        <span className="font-medium text-[#A60321]/90 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Duração: {service.duration_minutes || "--"} min
                                        </span>
                                    </div>
                                </div>
                            ))}
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

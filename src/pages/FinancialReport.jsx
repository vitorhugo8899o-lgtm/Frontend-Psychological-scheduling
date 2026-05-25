import React, { useState } from 'react';
import {
    Heart,
    Home,
    CalendarPlus,
    ClipboardListIcon,
    UserLock,
    Brain,
    Settings,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    ArrowLeft,
    DollarSign,
    BarChart2,
    AlertCircle,
    Loader2,
    Search,
    FileText,
    Calendar,
    Banknote
} from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    Bar,
    ComposedChart
} from 'recharts';

import SidebarButton from '../componentes/SidebarButton';
import { Logout } from '../servicies/Users';
import { useTheme } from '../context/ThemeContext';
import { GetFinancialReport } from '../servicies/Services';

export default function FinancialReport() {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reportData, setReportData] = useState(null);

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

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        setError(null);
        setReportData(null);

        if (!startDate || !endDate) {
            return setError("Preencha as datas de início e fim.");
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            return setError("A data final não pode ser menor que a inicial.");
        }

        const diffInDays = (end - start) / (1000 * 60 * 60 * 24);
        if (diffInDays > 365) {
            return setError("O período não pode ultrapassar 1 ano.");
        }

        setLoading(true);
        try {
            const response = await GetFinancialReport({ start_date: startDate, end_date: endDate });

            let rawData = response?.data || response;

            if (rawData && typeof rawData.json === 'function') {
                rawData = await rawData.json();
            }

            if (rawData && rawData.message) {
                throw new Error(rawData.message);
            }

            if (!rawData || !rawData.by_service) {
                throw new Error("A estrutura de dados retornada pelo servidor é inválida ou vazia.");
            }

            const sanitizedData = {
                total_general_revenue: Number(rawData.total_general_revenue) || 0,
                by_service: rawData.by_service.map(item => ({
                    ...item,
                    total_revenue: Number(item.total_revenue) || 0,
                    total_sales: Number(item.total_sales) || 0
                }))
            };

            setReportData(sanitizedData);
        } catch (err) {
            setError(err.message || "Ocorreu um erro inesperado ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    const totalSales = reportData?.by_service?.reduce((acc, curr) => acc + curr.total_sales, 0) || 0;

    return (
        <div className={`min-h-screen w-full flex flex-col transition-colors duration-300 overflow-hidden ${isDarkMode ? 'bg-[#0f172a] text-gray-100' : 'bg-[#FAF5EC] text-gray-800'
            }`}>

            <header className={`flex items-center justify-between p-4 md:px-8 border-b shrink-0 transition-colors duration-300 z-30 ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'
                }`}>
                <div className="flex items-center gap-2 text-lg md:text-xl font-semibold text-[#FAF5EC]">
                    <Heart className="w-5 h-5 md:w-6 md:h-6 fill-[#0a0909] text-[#A60321] shrink-0" />
                    <span className="truncate">Clínica Equilíbrio Mental</span>
                </div>
                <button onClick={() => setIsMenuOpen(true)} className="p-2 text-[#FAF5EC] hover:bg-white/10 rounded-lg transition-colors">
                    <Menu className="w-6 h-6 md:w-7 md:h-7" />
                </button>
            </header>

            {isMenuOpen && <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setIsMenuOpen(false)} />}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col py-8 border-r transition-transform duration-300 transform h-full ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } ${isDarkMode ? 'bg-[#090d16] border-gray-800' : 'bg-[#4A2E14] border-transparent'}`}>

                <div className={`px-6 pb-8 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-800' : 'border-white/10'}`}>
                    <div className="flex items-center gap-2 text-xl font-semibold text-[#FAF5EC]">
                        <Heart className="w-6 h-6 fill-[#0a0909] text-[#A60321] shrink-0" />
                        <span>Menu</span>
                    </div>
                    <button onClick={() => setIsMenuOpen(false)} className="text-[#FAF5EC] hover:bg-white/10 p-2 rounded-lg transition-colors">
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                <nav className="flex-1 py-8 flex flex-col gap-1 overflow-y-auto text-[#FAF5EC]">
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
                    />

                    <SidebarButton
                        icon={Banknote}
                        label="Relátorio Financeiro."
                        to='/financial-report'
                        isActive
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
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className={`text-2xl md:text-3xl font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`}>
                            Relatório Financeiro
                        </h1>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>
                            Análise de desempenho e faturamento da clínica
                        </p>
                    </div>
                    <Link to="/home-adm" className={`flex items-center gap-2 text-sm font-medium hover:underline ${isDarkMode ? 'text-gray-300' : 'text-[#4A2E14]'}`}>
                        <ArrowLeft className="w-4 h-4" /> Voltar
                    </Link>
                </header>

                <section className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'}`}>
                    <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="flex flex-col gap-2">
                            <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]'}`}>Data Inicial</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={`p-3 rounded-xl border outline-none transition-all ${isDarkMode ? 'bg-[#090d16] border-gray-700 text-white focus:border-[#A60321]' : 'bg-[#FAF5EC] border-[#8C5C32]/20 focus:border-[#A60321]'
                                    }`}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]'}`}>Data Final</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={`p-3 rounded-xl border outline-none transition-all ${isDarkMode ? 'bg-[#090d16] border-gray-700 text-white focus:border-[#A60321]' : 'bg-[#FAF5EC] border-[#8C5C32]/20 focus:border-[#A60321]'
                                    }`}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#A60321] text-white p-3 rounded-xl font-medium hover:bg-[#85021a] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            Gerar Relatório
                        </button>
                    </form>
                    {error && <div className="mt-4 flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"><AlertCircle className="w-4 h-4" /> {error}</div>}
                </section>

                {reportData && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'}`}>
                                <DollarSign className="w-8 h-8 text-[#A60321] mb-4" />
                                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>Receita Total Geral</h3>
                                <p className="text-2xl font-bold mt-1">{formatBRL(reportData.total_general_revenue)}</p>
                            </div>
                            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'}`}>
                                <BarChart2 className="w-8 h-8 text-[#A60321] mb-4" />
                                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-[#8C5C32]'}`}>Total de Vendas</h3>
                                <p className="text-2xl font-bold mt-1">{totalSales} <span className="text-sm font-normal text-gray-500">serviços</span></p>
                            </div>
                        </div>

                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'}`}>
                            <h3 className="text-base font-medium mb-6">Desempenho por Serviço</h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={reportData.by_service}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} />
                                        <XAxis dataKey="service_name" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: isDarkMode ? '#0f172a' : '#fff' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="total_revenue" name="Receita (R$)" fill="#A60321" radius={[4, 4, 0, 0]} />
                                        <Line type="monotone" dataKey="total_sales" name="Qtd Vendas" stroke="#8C5C32" strokeWidth={2} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#131c2e] border-gray-800' : 'bg-white border-[#8C5C32]/15'}`}>
                            <table className="w-full text-left">
                                <thead className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                    <tr>
                                        <th className="p-4 text-xs font-semibold uppercase">Serviço</th>
                                        <th className="p-4 text-xs font-semibold uppercase">Vendas</th>
                                        <th className="p-4 text-xs font-semibold uppercase text-right">Receita</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {reportData.by_service.map((s, i) => (
                                        <tr key={i} className="hover:bg-black/5 transition-colors">
                                            <td className="p-4 text-sm font-medium">{s.service_name}</td>
                                            <td className="p-4 text-sm">{s.total_sales}</td>
                                            <td className="p-4 text-sm font-bold text-right text-[#A60321]">{formatBRL(s.total_revenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {!loading && !reportData && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <FileText className={`w-16 h-16 mb-4 opacity-20 ${isDarkMode ? 'text-white' : 'text-[#4A2E14]'}`} />
                        <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-[#8C5C32]'}`}>
                            Selecione as datas desejadas para visualizar os dados financeiros.
                        </p>
                    </div>
                )}
            </main>

            <button
                onClick={toggleTheme}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl flex items-center gap-2 font-medium text-sm transition-all duration-300 z-50 ${isDarkMode ? 'bg-[#FAF5EC] text-[#4A2E14]' : 'bg-gray-900 text-white'
                    }`}
            >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
                <span className="hidden sm:inline">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
        </div>
    );
}
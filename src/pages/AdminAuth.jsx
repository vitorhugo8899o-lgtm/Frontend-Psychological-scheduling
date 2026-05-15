import React, { useState } from "react";
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { InputField } from "../componentes/Conponentes";
import { Login } from "../servicies/Users";

const AdminLoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!formData.email || !formData.password) {
            setErrorMessage("Credenciais administrativas são obrigatórias.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await Login(formData);
            if (response.user.role != 'adm') {
                setErrorMessage("O usuário não é um adiministrador")
                return;
            }
        } catch (error) {
            setErrorMessage(error.message || "Acesso negado.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF5EC] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-[#F2E9D8] overflow-hidden">

                <div className="px-8 pt-10 pb-6 text-center">
                    <div className="w-14 h-14 bg-[#A60321]/10 rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3">
                        <ShieldCheck className="w-7 h-7 text-[#A60321]" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">Painel Administrativo</h1>
                    <p className="text-[#8C5C32] mt-2 text-sm font-medium">Login</p>
                </div>

                {errorMessage && (
                    <div className="mx-8 mb-4 flex items-center gap-2 bg-[#A60321]/5 text-[#A60321] p-3 rounded-lg text-sm border border-[#A60321]/20">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{errorMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
                    <InputField
                        id="email"
                        label="E-mail Corporativo"
                        icon={Mail}
                        type="email"
                        placeholder="admin@email.com"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <InputField
                        id="password"
                        label="Chave de Segurança"
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 bg-gray-900 hover:bg-[#A60321] text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Login <ArrowRight className="w-5 h-5" /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
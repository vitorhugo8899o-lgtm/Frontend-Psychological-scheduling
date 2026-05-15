import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, LogIn, AlertCircle } from "lucide-react";
import { CreateUser, Login } from "../servicies/Users";
import { InputField } from "../componentes/Conponentes"


const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const { fullName, email, password } = formData;

        if (!email || !password || (!isLogin && !fullName)) {
            setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        if (!isLogin && !fullName.trim().includes(" ")) {
            setErrorMessage("O nome deve conter pelo menos um sobrenome (espaço).");
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Insira um e-mail válido.");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*!])[A-Za-z\d@#$%&*!]{8,}$/;
        if (password.length < 8) {
            setErrorMessage("A senha deve conter pelo menos 8 caracteres.");
            return;
        }

        if (!isLogin && !passwordRegex.test(password)) {
            setErrorMessage("Sua senha deve conter 8 caracteres, sendo eles: Número, letra maiúscula e minúscula e um caracter especial.");
            return;
        }

        setIsLoading(true);
        try {
            if (isLogin) {
                const data = {
                    email: email,
                    password: password
                }

                const response = await Login(data)
            } else {
                const data = {
                    fullname: fullName,
                    email: email,
                    password: password
                }
                const response = await CreateUser(data)
            }
        } catch (error) {
            console.error("Erro na integração:", error.message);
            setErrorMessage(error.message || "Ocorreu um erro inesperado. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF5EC] font-sans flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-500">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F2E9D8] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgb(166,3,33,0.08)]">

                <div className="px-8 pt-10 pb-6 text-center">
                    <div className="w-14 h-14 bg-[#F2E9D8] rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3 hover:rotate-6 transition-transform duration-300">
                        {isLogin ? (
                            <LogIn className="w-7 h-7 text-[#A60321]" />
                        ) : (
                            <User className="w-7 h-7 text-[#A60321]" />
                        )}
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight transition-all duration-300">
                        {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
                    </h1>
                    <p className="text-[#8C5C32] mt-2 text-sm font-medium">
                        {isLogin
                            ? "Insira seus dados para acessar sua conta."
                            : "Preencha os dados abaixo para começar."}
                    </p>
                </div>

                {errorMessage && (
                    <div className="mx-8 mb-4 flex items-center gap-2 bg-[#D97B66]/10 text-[#A60321] p-3 rounded-lg text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300 border border-[#D97B66]/30">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{errorMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
                    <div className="space-y-5 transition-all duration-500 ease-in-out">
                        {!isLogin && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                <InputField
                                    id="fullName"
                                    label="Nome Completo"
                                    icon={User}
                                    type="text"
                                    placeholder="Seu nome completo"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <InputField
                            id="email"
                            label="E-mail"
                            icon={Mail}
                            type="email"
                            placeholder="exemplo@email.com"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <div>
                            <InputField
                                id="password"
                                label="Senha"
                                icon={Lock}
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {isLogin && (
                                <div className="flex justify-end mt-2">
                                    <button type="button" className="text-xs font-semibold text-[#8C5C32] hover:text-[#A60321] transition-colors">
                                        Esqueceu sua senha?
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 bg-[#A60321] hover:bg-[#D97B66] text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#A60321]/30 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isLogin ? (
                            <>Entrar <ArrowRight className="w-5 h-5" /></>
                        ) : (
                            "Criar Conta Grátis"
                        )}
                    </button>
                </form>

                <div className="bg-[#FAF5EC] py-5 text-center border-t border-[#F2E9D8]">
                    <p className="text-sm text-[#8C5C32] font-medium">
                        {isLogin ? "Ainda não tem uma conta? " : "Já possui uma conta? "}
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-[#A60321] font-bold hover:text-[#D97B66] transition-colors underline-offset-4 hover:underline"
                        >
                            {isLogin ? "Cadastre-se" : "Faça Login"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
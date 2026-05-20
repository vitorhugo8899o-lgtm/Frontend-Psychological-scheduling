import { CheckCircle2, Home, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

export default function PaymentSuccessPage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 12, delay: 0.2 }
    },
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#e2e8f0] flex flex-col">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full border-b border-[#1f2937] bg-[#0f172a]/95 backdrop-blur-md fixed top-0 left-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-full border border-[#A60321]/40 bg-[#131c2e]">
            <Heart className="text-[#A60321] fill-[#A60321]" size={22} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-semibold tracking-wide text-white">
              Clínica Equilíbrio Mental
            </h1>
            <p className="text-xs text-slate-400">Cuidado com sua saúde emocional</p>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl"
        >
          <div className="bg-[#131c2e] border border-[#1f2937] rounded-2xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">

            <motion.div
              animate={{ opacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#A60321] blur-[120px]" />
            </motion.div>

            <motion.div variants={iconVariants} className="relative flex justify-center mb-8">
              <div className="w-28 h-28 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center shadow-lg shadow-green-500/10">
                <CheckCircle2 size={70} className="text-[#22c55e]" strokeWidth={1.8} />
              </div>
            </motion.div>

            <motion.h2 variants={itemVariants} className="relative text-3xl md:text-5xl font-semibold text-white leading-tight mb-6">
              Pagamento Confirmado<br />com Sucesso!
            </motion.h2>

            <motion.div variants={itemVariants} className="relative flex items-center justify-center gap-4 mb-8">
              <motion.div
                initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 1, delay: 0.5 }}
                className="h-px bg-[#A60321]/60"
              />
              <Heart className="text-[#A60321] fill-[#A60321]" size={18} />
              <motion.div
                initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 1, delay: 0.5 }}
                className="h-px bg-[#A60321]/60"
              />
            </motion.div>

            <motion.p variants={itemVariants} className="relative text-slate-300 text-base md:text-lg leading-8 max-w-xl mx-auto mb-10">
              Sua consulta foi agendada e o profissional já foi notificado. Você receberá os detalhes por e-mail e poderá acompanhar tudo na aba <span className="text-white font-medium">"Minhas Consultas"</span>.
            </motion.p>

            <motion.div variants={itemVariants} className="relative grid md:grid-cols-2 gap-4 mb-10">
              <div className="bg-[#0f172a] border border-[#1f2937] rounded-xl p-5 text-left hover:border-[#A60321]/30 transition-colors">
                <h3 className="text-white font-medium mb-2">Consulta Confirmada</h3>
                <p className="text-sm text-slate-400 leading-6">O agendamento foi realizado com sucesso e já está disponível em sua conta.</p>
              </div>
              <div className="bg-[#0f172a] border border-[#1f2937] rounded-xl p-5 text-left hover:border-[#A60321]/30 transition-colors">
                <h3 className="text-white font-medium mb-2">Detalhes por E-mail</h3>
                <p className="text-sm text-slate-400 leading-6">Você receberá em instantes todas as informações da consulta no e-mail cadastrado.</p>
              </div>
            </motion.div>


            <motion.div variants={itemVariants}>
              <Link
                to="/home"
                className="relative inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 rounded-xl bg-[#A60321] text-white font-medium text-lg shadow-lg shadow-[#A60321]/30 overflow-hidden group"
              >
                <motion.div
                  whileHover={{ x: '100%' }}
                  initial={{ x: '-100%' }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white/10 skew-x-12"
                />
                <Home size={22} className="relative z-10" />
                <span className="relative z-10">Voltar para o Início</span>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="relative mt-8">
              <p className="text-sm text-slate-500">
                Pagamento seguro e protegido com criptografia.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
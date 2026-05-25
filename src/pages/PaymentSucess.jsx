import { CheckCircle2 } from "lucide-react";
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
    <div className="min-h-screen bg-[#0f172a] text-[#e2e8f0] flex items-center justify-center px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <div className="bg-[#131c2e] border border-[#1f2937] rounded-2xl shadow-2xl p-8 md:p-10 text-center relative overflow-hidden">

          <motion.div
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#A60321] blur-[100px]" />
          </motion.div>

          <motion.div variants={iconVariants} className="relative flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center shadow-lg shadow-green-500/10">
              <CheckCircle2 size={60} className="text-[#22c55e]" strokeWidth={1.8} />
            </div>
          </motion.div>

          <motion.h2 variants={itemVariants} className="relative text-2xl md:text-3xl font-semibold text-white leading-tight mb-4">
            Pagamento Confirmado com Sucesso!
          </motion.h2>

          <motion.p variants={itemVariants} className="relative text-slate-400 text-sm md:text-base">
            Sua transação foi concluída. Você já pode retornar ao site com segurança.
          </motion.p>

        </div>
      </motion.div>
    </div>
  );
}
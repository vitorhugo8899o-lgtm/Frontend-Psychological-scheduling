import { AlertCircle } from "lucide-react";
import { motion } from 'framer-motion';

export default function PageNotFoundPage() {

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
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#f97316] blur-[100px]" />
                    </motion.div>

                    <motion.div variants={iconVariants} className="relative flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center shadow-lg shadow-orange-500/10">
                            <AlertCircle size={60} className="text-[#f97316]" strokeWidth={1.8} />
                        </div>
                    </motion.div>

                    <motion.h2 variants={itemVariants} className="relative text-2xl md:text-3xl font-semibold text-white leading-tight mb-2">
                        Página não encontrada
                    </motion.h2>

                    <motion.p variants={itemVariants} className="relative text-slate-400 text-sm md:text-base mb-8">
                        Desculpe, a página que você está procurando não existe ou foi movida.
                    </motion.p>

                    <motion.div variants={itemVariants} className="relative">
                        <div className="text-4xl md:text-5xl font-bold text-[#f97316]/40 mb-6">404</div>
                        <a
                            href="/"
                            className="inline-block bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                        >
                            Voltar para Home
                        </a>
                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
}

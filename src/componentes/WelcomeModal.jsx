import { useCallback, useEffect, useRef, useState } from 'react';
import { X, Info, Phone } from 'lucide-react';

const STORAGE_KEY = 'welcome-modal-dismissed';

const wasDismissed = () => {
    try {
        return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        return false;
    }
};

const markDismissed = () => {
    try {
        sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
    }
};

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(() => !wasDismissed());
    const closeButtonRef = useRef(null);

    const close = useCallback(() => {
        markDismissed();
        setIsOpen(false);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        closeButtonRef.current?.focus();

        const onKeyDown = (e) => {
            if (e.key === 'Escape') close();
        };
        document.addEventListener('keydown', onKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, close]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={close}
                aria-hidden="true"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="welcome-modal-title"
                className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FAF5EC] p-6 md:p-8 shadow-2xl border border-[#F2E9D8]"
            >
                <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={close}
                    aria-label="Fechar aviso"
                    className="absolute right-4 top-4 rounded-lg p-1.5 text-[#8C5C32] transition-colors hover:bg-[#F2E9D8] hover:text-[#A60321] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A60321]"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3 pr-8">
                    <div className="rounded-full bg-[#A60321]/10 p-2">
                        <Info className="h-6 w-6 text-[#A60321]" />
                    </div>
                    <h2 id="welcome-modal-title" className="text-xl font-bold text-[#4A2E14]">
                        Antes de começar
                    </h2>
                </div>

                <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#4A2E14]">
                    <p>
                        Este site é uma <strong>simulação</strong>. Os agendamentos, pagamentos e
                        cadastros feitos aqui são fictícios e não geram nenhuma consulta real.
                    </p>
                    <p>
                        Nenhum <strong>e-mail de confirmação</strong> será enviado durante a
                        simulação. Use os dados da própria tela para acompanhar cada etapa.
                    </p>

                    <div className="flex items-start gap-3 rounded-xl border border-[#A60321]/20 bg-[#A60321]/5 p-4">
                        <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#A60321]" />
                        <p>
                            Se você estiver passando por um momento difícil, o{' '}
                            <strong>CVV (Centro de Valorização da Vida)</strong> oferece apoio
                            emocional gratuito, 24 horas por dia. Ligue{' '}
                            <a href="tel:188" className="font-bold text-[#A60321] underline">188</a>{' '}
                            ou acesse{' '}
                            <a
                                href="https://www.cvv.org.br"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-[#A60321] underline"
                            >
                                cvv.org.br
                            </a>
                            .
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={close}
                        className="rounded-xl bg-[#A60321] px-6 py-3 font-bold text-white shadow-lg shadow-[#A60321]/30 transition-all hover:-translate-y-0.5 hover:bg-[#D97B66] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A60321] focus-visible:ring-offset-2"
                    >
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    );
}

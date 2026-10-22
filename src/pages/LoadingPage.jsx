
import { useEffect } from 'react';

export default function LoadingScreen() {
    useEffect(() => {
        document.title = 'Carregando | Clínica Equilíbrio Mental';
    }, []);

    return (
        <main
            role="status"
            aria-live="polite"
            style={{
                minHeight: '100vh',
                minHeight: '100dvh',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '40px 24px 28px',
                overflow: 'hidden',
                position: 'relative',
                background: '#faf8f5',
                color: '#244238',
                fontFamily: 'Inter, system-ui, sans-serif',
            }}
        >
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 60%, 100% {
            opacity: .35;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-5px);
          }
        }

        @keyframes appear {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .loading-spinner {
          animation: spin 1.5s linear infinite;
        }

        .loading-content {
          animation: appear .7s ease both;
        }

        .loading-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #789985;
          animation: pulse 1.2s ease-in-out infinite;
        }

        .loading-dot:nth-child(2) {
          animation-delay: .2s;
        }

        .loading-dot:nth-child(3) {
          animation-delay: .4s;
        }

        @media (max-width: 480px) {
          .loading-screen-brand {
            font-size: 14px !important;
          }

          .loading-screen-title {
            font-size: 26px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loading-spinner,
          .loading-content,
          .loading-dot {
            animation: none !important;
          }
        }
      `}</style>

            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: '#e8efe8',
                    opacity: 0.55,
                    top: -180,
                    left: -130,
                    pointerEvents: 'none',
                }}
            />

            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: '#e8efe8',
                    opacity: 0.55,
                    bottom: -200,
                    right: -120,
                    pointerEvents: 'none',
                }}
            />

            <header
                className="loading-screen-brand"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    zIndex: 1,
                    fontSize: 16,
                    letterSpacing: '-0.3px',
                }}
            >
                <div
                    style={{
                        width: 44,
                        height: 44,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '50%',
                        background: '#e2ebe2',
                        color: '#547b61',
                    }}
                >
                    <svg
                        viewBox="0 0 48 48"
                        width="34"
                        height="34"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M24 37V21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <path
                            d="M24 27C11 27 9 16 10 10C22 10 29 16 24 27Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M24 32C37 32 39 22 38 16C27 16 20 22 24 32Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <span>
                    Clínica <strong>Equilíbrio Mental</strong>
                </span>
            </header>

            <section
                className="loading-content"
                style={{
                    width: '100%',
                    maxWidth: 520,
                    textAlign: 'center',
                    zIndex: 1,
                }}
            >
                <div
                    className="loading-spinner"
                    aria-hidden="true"
                    style={{
                        width: 82,
                        height: 82,
                        margin: '0 auto 30px',
                        display: 'grid',
                        placeItems: 'center',
                        border: '3px solid #e1e9e0',
                        borderTopColor: '#658b70',
                        borderRightColor: '#91ae96',
                        borderRadius: '50%',
                    }}
                >
                    <span
                        style={{
                            color: '#658b70',
                            fontSize: 30,
                        }}
                    >
                        ✳
                    </span>
                </div>

                <h1
                    className="loading-screen-title"
                    style={{
                        margin: '0 0 14px',
                        fontSize: 'clamp(25px, 4vw, 34px)',
                        lineHeight: 1.25,
                        fontWeight: 650,
                        letterSpacing: '-1px',
                    }}
                >
                    Preparando seu espaço de cuidado
                </h1>

                <p
                    style={{
                        margin: 0,
                        color: '#718078',
                        fontSize: 15,
                        lineHeight: 1.8,
                    }}
                >
                    Estamos organizando tudo para você.
                    <br />
                    Só um instante...
                </p>

                <div
                    aria-hidden="true"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 7,
                        marginTop: 28,
                    }}
                >
                    {[1, 2, 3].map((dot) => (
                        <span key={dot} className="loading-dot" />
                    ))}
                </div>
            </section>

            <footer
                style={{
                    zIndex: 1,
                    color: '#819087',
                    fontSize: 12,
                    letterSpacing: '0.4px',
                    textAlign: 'center',
                }}
            >
                Cuidar de você começa aqui.
            </footer>
        </main>
    );
}

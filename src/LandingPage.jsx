import './App.css'

export default function InitialPage() {
  const services = [
    {
      title: "Terapia Cognitivo-Comportamental",
      tag: "TCC",
      desc: "Abordagem estruturada e baseada em evidências que ajuda a compreender como pensamentos, emoções e comportamentos estão interligados.",
    },
    {
      title: "Terapia Humanista",
      tag: "Humanista",
      desc: "Focada no autoconhecimento, crescimento pessoal e fortalecimento emocional através de uma escuta acolhedora.",
    },
    {
      title: "Terapia de Aceitação e Compromisso",
      tag: "ACT",
      desc: "Auxilia no desenvolvimento de flexibilidade emocional e ações alinhadas aos valores pessoais.",
    },
  ];

  const professionals = [
    {
      initials: "AM",
      name: "Dra. Ana Meirelles",
      role: "Psicóloga Clínica",
    },
    {
      initials: "RC",
      name: "Dr. Rafael Carvalho",
      role: "Psicólogo Clínico",
    },
    {
      initials: "LF",
      name: "Dra. Luísa Ferreira",
      role: "Psicóloga Clínica",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF5EC] text-[#4A2E14]">
      <header className="fixed top-0 left-0 w-full z-50 border-b border-[#d9a57733] bg-[#F2E9D8]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif text-[#A60321]">
              Equilíbrio Mental
            </h1>
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C5C32]">
              Clínica de Psicologia
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wider text-[#8C5C32]">
            <a href="#sobre" className="hover:text-[#A60321] transition">
              Sobre
            </a>
            <a href="#servicos" className="hover:text-[#A60321] transition">
              Serviços
            </a>
            <a href="#profissionais" className="hover:text-[#A60321] transition">
              Profissionais
            </a>
          </nav>

          <button className="bg-[#A60321] hover:bg-[#8C5C32] transition text-white px-5 py-2 rounded-md text-sm uppercase tracking-wide">
            Agendar Consulta
          </button>
        </div>
      </header>

      <section className="pt-40 pb-28 px-6 bg-[#F2E9D8]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="uppercase tracking-[0.3em] text-sm text-[#D97B66]">
              Saúde Mental & Bem-estar
            </span>

            <h2 className="mt-6 text-5xl md:text-6xl leading-tight font-serif text-[#4A2E14]">
              Cuidar da mente é <span className="italic text-[#A60321]">cuidar de si.</span>
            </h2>

            <p className="mt-8 text-lg leading-8 text-[#8C5C32] max-w-xl">
              Um espaço acolhedor para quem busca equilíbrio emocional,
              autoconhecimento e qualidade de vida através de um atendimento
              humanizado e especializado.
            </p>
          </div>
        </div>
      </section>

      <section id="sobre" className="py-24 px-6 bg-[#FAF5EC]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="uppercase tracking-[0.3em] text-sm text-[#D97B66]">
              Sobre Nós
            </span>

            <h2 className="mt-4 text-5xl font-serif leading-tight">
              Sua história merece ser <span className="italic text-[#A60321]">acolhida.</span>
            </h2>

            <div className="mt-8 space-y-6 text-[#8C5C32] leading-8 text-lg">
              <p>
                Na Clínica Equilíbrio Mental, acreditamos que cada pessoa
                possui experiências únicas que merecem acolhimento, empatia e
                profissionalismo.
              </p>

              <p>
                Nosso objetivo é proporcionar um ambiente seguro e humanizado,
                oferecendo suporte psicológico especializado para diferentes
                fases da vida.
              </p>

              <p>
                Trabalhamos com abordagens reconhecidas cientificamente,
                promovendo desenvolvimento emocional, autoconhecimento e
                qualidade de vida.
              </p>
            </div>
          </div>

          <div className="bg-[#F2E9D8] border border-[#D9A57755] rounded-2xl p-10 shadow-sm">
            <p className="text-3xl leading-relaxed italic font-serif text-[#4A2E14]">
              “Mais do que tratar sintomas, buscamos compreender cada pessoa de
              forma completa, valorizando sua trajetória e individualidade.”
            </p>
          </div>
        </div>
      </section>

      <section id="servicos" className="py-24 px-6 bg-[#F2E9D8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div>
              <span className="uppercase tracking-[0.3em] text-sm text-[#D97B66]">
                Nossas Abordagens
              </span>

              <h2 className="mt-4 text-5xl font-serif leading-tight">
                Serviços <span className="italic text-[#A60321]">especializados</span>
              </h2>
            </div>

            <button className="bg-[#A60321] hover:bg-[#8C5C32] transition text-white px-6 py-3 rounded-md uppercase tracking-wide text-sm h-fit">
              Entra com sua conta para visualizar todos os Serviços
            </button>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-[#FAF5EC] border border-[#D9A57744] rounded-2xl p-8 hover:-translate-y-1 hover:shadow-xl transition"
              >
                <span className="inline-block bg-[#A6032115] text-[#A60321] text-xs uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-5">
                  {service.tag}
                </span>

                <h3 className="text-3xl font-serif mb-5 text-[#4A2E14] leading-tight">
                  {service.title}
                </h3>

                <p className="text-[#8C5C32] leading-8">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="profissionais" className="py-24 px-6 bg-[#FAF5EC]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="uppercase tracking-[0.3em] text-sm text-[#D97B66]">
            Nossa Equipe
          </span>

          <h2 className="mt-4 text-5xl font-serif leading-tight">
            Profissionais <span className="italic text-[#A60321]">dedicados</span>
          </h2>

          <p className="mt-6 text-lg text-[#8C5C32] max-w-2xl mx-auto leading-8">
            Uma equipe preparada para oferecer acolhimento, ética e cuidado em
            cada atendimento.
          </p>

          <div className="mt-16 grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {professionals.map((professional) => (
              <div
                key={professional.name}
                className="bg-[#F2E9D8] border border-[#D9A57744] rounded-2xl p-8 shadow-sm hover:shadow-lg transition"
              >
                <div className="w-20 h-20 rounded-full bg-[#A60321] text-white flex items-center justify-center mx-auto text-2xl font-serif mb-6">
                  {professional.initials}
                </div>

                <h3 className="text-2xl font-serif text-[#4A2E14]">
                  {professional.name}
                </h3>

                <p className="mt-2 text-[#8C5C32]">
                  {professional.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#4A2E14] text-[#F2E9D8] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl font-serif">Equilíbrio Mental</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#D9A577]">
              Clínica de Psicologia
            </p>
          </div>

          <div className="text-sm text-[#F2E9D8]/70 text-center md:text-right leading-7">
            © 2026 Clínica Equilíbrio Mental. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

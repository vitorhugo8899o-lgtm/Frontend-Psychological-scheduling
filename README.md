<div align="center">
  <img width="1408" height="670" alt="Logo-software-png" src="https://github.com/user-attachments/assets/ee234c81-5dce-49df-b4c5-1ebc5810f3ff" />
</div>

# MentalHealing Software (Frontend)

O **MentalHealing Software** é uma plataforma desenvolvida para facilitar o agendamento e a gestão de consultas com profissionais da área da saúde mental. Por meio do sistema, os usuários podem encontrar profissionais e agendar consultas de forma prática, rápida e segura.

Além disso, a plataforma oferece recursos completos para os profissionais, permitindo o gerenciamento de horários de atendimento, consultas agendadas, métricas de desempenho e acompanhamento da rotina clínica.

O sistema também conta com um módulo administrativo voltado para a gestão da clínica, possibilitando o cadastro de novos psicólogos, controle de relatórios financeiros, gerenciamento de perfis, desativação de contas e administração geral da plataforma.

---
<br/>

## Arquitetura

A aplicação frontend se comunica com a API backend via HTTP, seguindo o modelo:

```
┌─────────────────────────┐
│     Frontend (React)    │
│    (Este repositório)   │
└────────────┬────────────┘
             │
             │ HTTP Requests (com cookies)
             ▼
┌─────────────────────────┐
│   Redis (Rate Limit)    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐               SERVIÇOS EXTERNOS
│     FastAPI Backend     │       ┌─────────────────────────────────┐
│        (API REST)       ├──────►│ Mercado Pago (Gateway de Pag.)  │
└────────────┬────────────┘       └─────────────────────────────────┘
             │                    ┌─────────────────────────────────┐
             ├───────────────────►│       GROQ (Agente de IA)       │
             │                    └─────────────────────────────────┘
             ▼
┌─────────────────────────┐
│      Redis (Cache)      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│     Banco de Dados      │
│      (PostgreSQL)       │
└─────────────────────────┘
```

* Comunicação baseada em **requisições HTTP com autenticação via cookies**
* Separação clara entre camada de apresentação (frontend) e lógica de negócio (backend)


---
<br/>

## Funcionalidades (Paciente)
* Simulação de consultas — Informe uma data e horário para visualizar quais profissionais estarão disponíveis naquele período.
* Próximas consultas — Visualize rapidamente todas as consultas confirmadas e agendadas.
* Histórico de consultas — Acesse o registro completo das consultas já realizadas.
* ChatBot inteligente — Assistente virtual com IA para responder dúvidas sobre a clínica e oferecer suporte básico sobre o sistema.
* Agendamento de consultas — Marque consultas de forma prática com o profissional desejado.
* Consultas em andamento — Acompanhe consultas pendentes, não pagas ou aguardando confirmação.
* Busca avançada de serviços — Filtre profissionais e serviços de acordo com suas necessidades

## Funcionalidades (Psicólogo)
* Gerenciamento de horários — Defina horários de atendimento, dias disponíveis e realize alterações ou remoções quando necessário.
* Histórico de consultas — Consulte registros de atendimentos anteriores.
* Próximas consultas — Visualize facilmente os próximos atendimentos confirmados.
* Gerenciamento de prontuários — Crie, edite, liste e remova prontuários de pacientes.
* Métricas e desempenho — Acompanhe indicadores como número de consultas realizadas, taxa de cancelamento e taxa de confirmação para análise de desempenho profissional.
 
## Funcionalidades (Administrador)
* Cadastro de psicólogos — Adicione novos profissionais ao sistema.
* Gerenciamento de serviços — Cadastre e administre os serviços oferecidos pela clínica.
* Controle de usuários — Ative ou desative contas de pacientes e psicólogos.
* Relatórios financeiros — Acesse relatórios financeiros para acompanhamento da clínica.

--- 
<br/>

##  Tecnologias Utilizadas

| Tecnologia              | Descrição                                         |
| :---------------------- | :------------------------------------------------ |
| **React.js**            | Biblioteca principal para construção da interface |
| **Vite**                | Bundler moderno com foco em performance           |
| **React Router DOM**    | Gerenciamento de rotas SPA                        |
| **CSS / UI Responsiva** | Interface adaptável com foco em UX                |
| **JavaScript (ES6+)**   | Lógica da aplicação                               |

---

##  Autenticação

A autenticação é baseada em **cookies HttpOnly**, fornecidos pelo backend.

### Fluxo:

1. Usuário realiza login
2. Backend retorna cookie seguro
3. Frontend utiliza automaticamente o cookie nas requisições subsequentes
4. Rotas protegidas são renderizadas com base no estado do usuário, validando com o Backend se o usuário de fato está autenticado

---
<br/>

##  Rotas da Aplicação

| Rota                         | Componente                | Descrição                                                   |
| :---------------------------- | :------------------------ | :---------------------------------------------------------- |
| `/`                           | `InitialPage`             | Landing Page institucional                                  |
| `/auth`                       | `AuthPage`                | Autenticação de usuários / criação de conta                 |
| `/auth-admin`                 | `AdminLoginPage`          | Autenticação para administradores                           |
| `/auth-psych`                 | `PsychLoginPage`          | Autenticação para psicólogos                                |
| `/payment-confirm`            | `PaymentSuccessPage`      | Página de confirmação de pagamento                          |
| `/home`                       | `ClinicaHome`             | Página inicial do paciente                                  |
| `/simulation`                 | `Simulation`              | Simulação de consultas disponíveis                          |
| `/filter-services`            | `SearchServices`          | Busca e filtragem de serviços                               |
| `/settings`                   | `AccountSettings`         | Configurações da conta do usuário                           |
| `/history-appoiment`          | `AppointmentHistory`      | Histórico de consultas do paciente                          |
| `/appoiment`                  | `ScheduleAppoiment`       | Agendamento de consultas                                    |
| `/appoiments/in-progress`     | `AppointmentsInProgress`  | Consultas pendentes ou em andamento                         |
| `/chat-mira`                  | `ChatMira`                | ChatBot inteligente de suporte                              |
| `/home-adm`                   | `HomeAdm`                 | Página inicial do administrador                             |
| `/users-list`                 | `UserList`                | Listagem de usuários cadastrados                            |
| `/user-info`                  | `UserInfo`                | Visualização detalhada de informações do usuário            |
| `/add-psych`                  | `AddPsych`                | Cadastro de novos psicólogos                                |
| `/create-service`             | `CreateServicePage`       | Cadastro de novos serviços                                  |
| `/financial-report`           | `FinancialReport`         | Relatórios financeiros da clínica                           |
| `/home-psych`                 | `HomePsych`               | Página inicial do psicólogo                                 |
| `/avaliabilites`              | `AvailabilityList`        | Listagem de horários de atendimento                         |
| `/create-avaliabilite`        | `CreateAvailability`      | Cadastro de novos horários de atendimento                   |
| `/psych-history`              | `AppointmentHistoryPsych` | Histórico de consultas do psicólogo                         |
| `/dashboard`                  | `DashboardPsych`          | Dashboard com métricas e desempenho do psicólogo            |
| `/create-record`              | `MedicalRecord`           | Criação de prontuários médicos                              |
| `/record-user`                | `ClientRecordList`        | Listagem de prontuários de um paciente específico           |
| `/medical-records`            | `MedicalRecordList`       | Listagem geral de prontuários cadastrados                   |

---

##  Preview da Interface
<div align="left">
  <img width="1280" height="914" alt="Tela_inicial_users" src="https://github.com/user-attachments/assets/9038e7d7-58c4-472c-90fa-995f3e37a57c" /> 
</div>

---

<div align="left">
  <img width="1273" height="894" alt="AdminHome" src="https://github.com/user-attachments/assets/2c2e4468-eb06-46e5-896f-a86d4df5eeb5" />
</div>

---

<div align="left">
 <img width="1279" height="898" alt="PsychHome" src="https://github.com/user-attachments/assets/ac0ee0f3-bd44-42be-b5f8-987296bab83f" />
</div>

---
<br/>

##  Como Executar

### Pré-requisitos

* Node.js (v18+ recomendado)
* npm ou yarn

### Passos

1. Clone o repositório:

```bash
git clone https://github.com/vitorhugo8899o-lgtm/Frontend-Psychological-scheduling
```

2. Acesse a pasta do projeto:

```bash
cd Frontend-Psychological-scheduling
```

3. Instale as dependências:

```bash
npm install
```

4. Execute a aplicação:

```bash
npm run dev
```

---

###  Acesso

* Aplicação: http://localhost:5173

OBS: Garanta que tenha o backend do MentalHealing Software rodando na sua maquina também, link: https://github.com/vitorhugo8899o-lgtm/Psychological-scheduling

---

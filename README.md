# Brand Compliance Agent 🛡️
> Sistema de Auditoria de Diretrizes de Marca e Governança Visual com IA Multimodal para Grandes Marcas Industriais (ex: ANDRITZ AG).

---

## 🚀 Sobre o Projeto
O **Brand Compliance Agent** foi arquitetado para resolver o problema crítico de governança e aprovação ágil de layouts publicitários, apresentações, anúncios e materiais técnicos de engenharia em grandes corporações industriais.

### 🛡️ O Desafio do Brand Guide Protegido
Grandes empresas (como a **ANDRITZ**) mantêm seus manuais em portais corporativos protegidos por link direto (ex: `https://brandportal.andritz.com/hub/5`) sem exportação simples para arquivos estáticos. 

O sistema resolve isso através de:
1. **Base de Conhecimento Editável (O "Cérebro" do Agente):** Permite colar trechos de texto, atualizar códigos HEX oficiais, famílias tipográficas, regras de respiro do logotipo (*Clear Space* baseado na altura do 'A' de ANDRITZ) e termos obrigatórios/proibidos.
2. **Referência Direta ao Portal Oficial:** Atalho no cabeçalho para acesso direto ao Brand Portal corporativo.
3. **Análise Multimodal e Checklist Cirúrgico:** Confronta imagens (PNG, JPG) ou layouts (PDF) contra as diretrizes, gerando um checklist acionável para o designer com:
   - **O que foi identificado na peça**
   - **A regra oficial do Brand Guide violada**
   - **Sugestão cirúrgica de correção para o designer**

---

## 🛠️ Tecnologias Utilizadas
- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com design system corporativo de alta performance
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Inteligência Artificial:**
  - Suporte nativo a **OpenAI GPT-4o Vision** e **Google Gemini Vision**.
  - **Motor Analítico Embutido:** Permite testar e usar a aplicação imediatamente sem depender de chave de API externa caso não esteja configurada.

---

## 🏁 Como Rodar o Projeto

### 1. Entrar no diretório do projeto:
```bash
cd /Users/guidozimmermann/.gemini/antigravity/scratch/brand-compliance-agent
```

### 2. Iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📁 Estrutura de Arquivos

```
brand-compliance-agent/
├── src/
│   ├── app/
│   │   ├── api/audit/route.ts       # Endpoint de auditoria multimodal (OpenAI / Gemini / Fallback)
│   │   ├── globals.css              # Estilos globais e regras para impressão/exportação
│   │   ├── layout.tsx               # Root layout com metadados
│   │   └── page.tsx                 # Dashboard principal do operador
│   ├── components/
│   │   ├── Header.tsx               # Barra superior com acesso rápido a regras, portal e histórico
│   │   ├── BrandSelector.tsx        # Seletor de marca ativa e resumo de diretrizes
│   │   ├── BrandGuideEditorModal.tsx# Base de conhecimento editável (Cores, Fontes, Logo, Tom de Voz)
│   │   ├── UploadSection.tsx        # Drag-and-drop, preview de layout e botões de teste rápido
│   │   ├── AuditReportView.tsx      # Relatório executivo e checklist cirúrgico de desvios
│   │   ├── AuditHistoryDrawer.tsx   # Gaveta de histórico de auditorias realizadas
│   │   └── ApiSettingsModal.tsx     # Modal de configuração de chaves de API (OpenAI / Gemini)
│   ├── lib/
│   │   ├── defaultBrands.ts         # Diretrizes oficiais completas pré-carregadas da ANDRITZ AG
│   │   ├── aiAudit.ts               # Construtor de prompts, integração com IA e motor analítico
│   │   └── utils.ts                 # Utilitários de classes e formatação de arquivos
│   └── types/
│       ├── brand.ts                 # Interfaces TypeScript para o Brand Guide
│       └── audit.ts                 # Interfaces para desvios, relatórios e payloads
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```


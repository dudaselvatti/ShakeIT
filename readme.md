# ShakeIT

O **ShakeIT** é um aplicativo mobile desenvolvido em React Native (Expo) que moderniza a experiência do tradicional "Amigo Secreto". O app utiliza o acelerômetro do smartphone e a leitura de QR Code para criar uma revelação interativa, segura e divertida entre os participantes.

## Interface do Aplicativo

> _(Adicione screenshots do aplicativo conforme o desenvolvimento das telas avançar nesta seção)_

![Preview do Projeto](./assets/adaptive-icon.png)

---

## Tecnologias e Ferramentas

- **Framework:** React Native com Expo (Managed Workflow)
- **Linguagem:** TypeScript para tipagem estática e segurança
- **Testes:** Jest e React Native Testing Library
- **Hardware:** Expo Sensors (Acelerômetro) e Expo Barcode Scanner

---

## Como Executar o Projeto

Para rodar o ambiente de desenvolvimento, você precisará do **Node.js** instalado e do aplicativo **Expo Go** no seu smartphone, caso deseje testar diretamente por ele.

### 1. Clone o repositório:

```bash
git clone https://github.com/dudaselvatti/ShakeIT.git
```

### 2. Instale as dependências:

```bash
npm install
```

### 3. Inicie o servidor do Expo:

```bash
npx expo start
```

Escaneie o QR Code no terminal com a câmera do seu celular (iOS) ou pelo app Expo Go (Android).

---

## Qualidade e Testes

Testes
Implementamos uma cultura de testes desde a base do projeto para garantir que as lógicas de hardware e sorteio sejam confiáveis. Para rodar a suíte de testes, utilize:

```bash
npm test
```

Linting (Padronização)
Para verificar erros de sintaxe e manter as boas práticas do Expo:

```bash
npm run lint
```

---

## Estrutura de Pastas (Arquitetura)

O projeto segue uma estrutura modular e organizada dentro da pasta `src/` para facilitar a manutenção:

```plaintext
ShakeIT/
├── src/
│   ├── assets/        # Mídias, ícones e fontes locais
│   ├── components/    # Elementos visuais reutilizáveis (botões, cards, inputs)
│   │   └── __tests__/ # Testes unitários dos componentes
│   ├── mocks/         # Dados fictícios para simulação de estados (Fake API)
│   ├── screens/       # Telas principais do fluxo do usuário
│   ├── styles/        # Temas, cores globais e tokens de design
│   └── utils/         # Funções auxiliares e lógica dos sensores
├── App.tsx            # Ponto de entrada e configuração global
├── jest.config.js     # Configurações do ambiente de testes
└── tsconfig.json      # Configurações do TypeScript
```

---

## Documentação e Gestão (Wiki)

Para diretrizes de contribuição, atas de reunião, detalhes da lógica do acelerômetro e acompanhamento das Sprints, acesse a nossa Wiki oficial no GitHub.

---

## Equipe de Desenvolvimento

- Maria Eduarda Alves Selvatti - Scrum Master
- Ana Julia Pires Oliveira - Product Owner
- Nathalie Gonçalves Xavier - Developer
- Rodrigo Quadrante Freitas - Developer

# Diretrizes e Definições de Desenvolvimento (Frontend)

Este documento define as regras obrigatórias de conduta, arquitetura e boas práticas para o desenvolvimento do **Frontend** do projeto **Compradores**.

---

## 1. Regras de Conduta do Assistente (Obrigatórias)

1. **Apenas o Solicitado:**
   * Implementar **estritamente** o que o usuário pedir.
   * Não criar arquivos, pastas, bibliotecas ou recursos adicionais que não tenham sido solicitados de forma explícita.

2. **Alinhamento e Proposta Prévia:**
   * Toda melhoria, sugestão de arquitetura, refatoração ou adição de ferramenta deve ser **proposta e explicada primeiro**.
   * Nenhuma implementação de proposta deve ocorrer sem a aprovação prévia do usuário.

3. **Código Limpo, Otimizado e Escalável:**
   * Código enxuto, sem duplicações e sem débitos técnicos desnecessários.
   * Não deixar arquivos mortos, não utilizados ou redundantes na árvore do projeto.
   * Estruturar o código pensando em crescimento (fácil manutenção para o MVP e além).

---

## 2. Stack Técnica e Definições do Frontend

* **Ambiente de Execução / Bundler:** [Vite](https://vite.dev/) (ES Modules, `"type": "module"` no `package.json`).
* **Porta Local:** `http://localhost:5173/`
* **Framework CSS:** [Tailwind CSS v4](https://tailwindcss.com/) integrado nativamente com `@tailwindcss/vite`.
* **Ponto de Entrada CSS:** `src/input.css` (onde se importa `@import "tailwindcss";`).
* **Reutilização de Estilos:**
  * Priorizar classes utilitárias do Tailwind no HTML.
  * Para componentes repetitivos (ex: botões, inputs, cards), utilizar classes semânticas reutilizáveis em `src/input.css` usando `@apply`.
* **Ponto de Entrada da Aplicação:** `index.html` consumindo `./src/input.css` e `./app.js` como módulo ES (`type="module"`).

---

## 3. Estrutura de Arquivos Permitida

```text
frontend/
├── .gitignore          # Ignora node_modules/ e dist/
├── .vscode/            # Configurações do editor (ex: suprimir alertas de unknownAtRules)
├── INSTRUCTIONS.md     # Este arquivo de instruções
├── app.js              # Lógica JavaScript da aplicação
├── index.html          # HTML principal
├── package.json        # Dependências e scripts de execução
├── vite.config.js      # Configuração do Vite + plugin Tailwind
└── src/
    └── input.css       # Estilos globais e componentes reutilizáveis (@apply)
```

> **Atenção:** A pasta `dist/` nunca deve ser versionada nem mantida durante o desenvolvimento comum (ela é gerada apenas no comando `npm run build` para deploy).

---

## 4. Scripts Padrão

* `npm run dev`: Inicia o servidor local com Hot Module Replacement (HMR).
* `npm run build`: Compila e minifica assets para distribuição de produção.
* `npm run preview`: Permite visualizar localmente o resultado do build de produção.

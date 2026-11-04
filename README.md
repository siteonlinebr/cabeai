# CabeAí — Seu móvel cabe. E chega até lá?

> **CabeAí** é uma aplicação web brasileira que ajuda você a verificar se móveis, eletrodomésticos e outros objetos cabem nos cômodos da sua casa e conseguem passar por portas, corredores, escadas e elevadores antes de você comprar ou receber uma entrega.

Um projeto independente integrante do [Future Horizon Group (FHG)](https://siteonlinebr.github.io/Fhg.com.br/).

---

## 📐 O que o CabeAí resolve?

1. **Acomodação no Ambiente:** O sofá, cama ou geladeira cabe no espaço disponível, respeitando as folgas de ventilação do fabricante e a circulação de 60 cm para passagem?
2. **Caminho de Entrega:** O produto montado ou embalado na caixa consegue passar pela porta de entrada, pelo corredor com curva de 90° e entrar na cabine do elevador ou escada?

---

## ✨ Funcionalidades Principais

- **Simulador Interativo de Dimensões:** Entrada em centímetros ou metros com diagramas em SVG proporcional, calculando folga lateral, frontal e vertical.
- **Rotação Inteligente 90°:** Testa se virar o móvel permite encaixá-lo caso não caiba na orientação padrão.
- **Folgas Específicas de Fabricante:** Recomendações térmicas para refrigeradores e margem antivibração para lavadoras.
- **Diagnóstico Completo do Caminho:** Análise geométrica para portas (vão útil com porta aberta em 90°), corredores (giro horizontal vs vertical), elevadores (diagonal tridimensional da cabine) e escadas.
- **Medir meu Espaço:** Cadastro e gerenciamento de cômodos (Sala, Quartos, Cozinha, Lavanderia) para reutilização com 1 clique.
- **Meus Projetos:** Armazenamento local persistente via `localStorage`, com duplicação de projetos e exportação/importação de backup em JSON.
- **Guias & Manuais Editoriais:** Artigos aprofundados sobre normas ABNT de circulação, medidas de colchões e dicas práticas de mudança.
- **Suíte de Testes Automatizados:** Testes matemáticos integrados executáveis diretamente na interface.

---

## 🚀 Publicação no GitHub Pages

O projeto já está 100% configurado para rodar em subdiretórios no GitHub Pages (ex: `https://<usuario>.github.io/cabeai/`).

### Publicação Automática (GitHub Actions)
1. Crie um repositório no seu GitHub com o nome `cabeai`.
2. Envie o código:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit CabeAi"
   git branch -M main
   git remote add origin https://github.com/<seu-usuario>/cabeai.git
   git push -u origin main
   ```
3. No GitHub, acesse **Settings > Pages**.
4. Em **Build and deployment > Source**, selecione **GitHub Actions**.
5. O workflow em `.github/workflows/deploy.yml` fará o build e publicação automaticamente!

### Build Manual
Para gerar os arquivos estáticos localmente:
```bash
npm install
npm run build
```
Os arquivos prontos para qualquer servidor web ou CDN estarão na pasta `dist/`.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Vite 8** (com `base: './'` para compatibilidade de subdiretório)
- **Tailwind CSS v4**
- **Lucide Icons**
- **SVG Geométrico Dinâmico**

---

## 📄 Licença e Créditos

Desenvolvido para consumidores e planejadores residenciais no Brasil.  
Integrado institucionalmente ao [Future Horizon Group (FHG)](https://siteonlinebr.github.io/Fhg.com.br/).

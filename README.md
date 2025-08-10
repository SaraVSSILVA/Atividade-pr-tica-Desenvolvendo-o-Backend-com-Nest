# 📚 Letrário — Gerencie sua biblioteca pessoal com estilo

**Letrário** é uma aplicação completa (fullstack) para organização de acervos literários. Com uma API robusta em NestJS e uma interface intuitiva em [React]. O projeto nasceu para gerênciar meu livros, e hoje evolui como uma ferramenta para qualquer leitor que deseja organizar seus livros, acompanhar empréstimos e planejar futuras aquisições.

---

## 🖥️ Acesso à Aplicação

- 🌐 **Frontend (produção):** [https://letrario.app](https://letrario.app)  
- 🔌 **API (produção):** [https://api.letrario.app](https://api.letrario.app)  
- 📑 **Documentação Swagger:** [https://api.letrario.app/api](https://api.letrario.app/api)

---

## ✨ Funcionalidades

### Backend (NestJS)
- 👤 Usuários: Cadastro, autenticação via JWT, listagem
- 📚 Livros: Cadastro, atualização, listagem, associação com gêneros
- 🏷️ Gêneros: Cadastro e listagem
- 🔄 Empréstimos: Registro, devolução, histórico
- 💭 Wishlist: Gerenciamento de desejos literários

### Frontend ([React/Vue/etc.])
- 🧭 Navegação amigável e responsiva
- 🔐 Login e cadastro com feedback visual
- 📚 Visualização de livros com capas e filtros
- 📊 Painel de empréstimos e histórico
- 💡 Wishlist interativa com sugestões

---

## 🛠️ Tecnologias Utilizadas

| Camada       | Tecnologias                                                                 |
|--------------|------------------------------------------------------------------------------|
| Backend      | NestJS, TypeORM, PostgreSQL, JWT, Swagger                                   |
| Frontend     | [React/Vue], Axios, Styled Components/Tailwind, React Router           |
| Deploy       | Railway         |

---

## 🚀 Instalação Local

### Backend
```bash
git clone <url-do-repositorio>
cd letrario/backend
npm install
npm run typeorm:migration:run
npm run start:dev
```

### Frontend
```bash
cd letrario/frontend
npm install
npm run dev
```

> Certifique-se de configurar as variáveis de ambiente em ambos os diretórios (`.env`).

---

## 🧪 Scripts úteis

```bash
# Backend
npm run test:e2e        # Testes end-to-end
npx eslint . --fix      # Correção de lint

# Frontend
npm run lint            # Verifica problemas de estilo
npm run build           # Gera versão de produção
```

---

## 🤝 Contribuição & Patrocínio

Pull requests são super bem-vindos! Se você encontrou um bug, pensou numa melhoria ou quer adicionar uma nova funcionalidade, fique à vontade para contribuir. Se você gostou do projeto e quer apoiar seu desenvolvimento, considere se tornar um patrocinador. Toda ajuda — seja financeira, técnica ou em divulgação — é muito bem-vinda e ajuda o Letrário a crescer.
💡 Formas de apoiar:
- Doações
- Parcerias com editoras, clubes de leitura ou livrarias
- Divulgação do projeto em redes sociais ou comunidades de tecnologia 📬 Para patrocínio ou colaboração institucional: Entre em contato pelo e-mail: saravitoriads@outlook.com


---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** — sinta-se livre para usar, estudar e contribuir.

---

**Letrário** — *Onde seus livros têm voz e sua estante ganha vida.*

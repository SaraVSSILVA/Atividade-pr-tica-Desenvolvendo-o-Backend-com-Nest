# LETRÁRIO (Backend Nest)

Este projeto é o backend do LETRÁRIO, uma aplicação desenvolvida com o framework [NestJS](https://nestjs.com/) para gerenciamento de livros, gêneros, usuários, empréstimos e listas de desejos.

## Sumário

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Padrão de Código e Boas Práticas](#padrão-de-código-e-boas-práticas)
- [Licença](#licença)

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io/)
- [JWT](https://jwt.io/) para autenticação
- [Bcrypt](https://www.npmjs.com/package/bcrypt) para hash de senhas

## Estrutura do Projeto

O projeto está organizado em módulos, seguindo o padrão do NestJS:

- `auth/` - Autenticação e autorização de usuários
- `books/` - Gerenciamento de livros
- `genres/` - Gerenciamento de gêneros literários
- `loan/` - Controle de empréstimos de livros
- `users/` - Gerenciamento de usuários
- `whishlist/` - Gerenciamento de listas de desejos
- `migrations/` - Migrações do banco de dados

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```

## Configuração

- Configure as variáveis de ambiente e o acesso ao banco de dados em `ormconfig.ts`.
- Ajuste outros parâmetros conforme necessário nos arquivos de configuração.

## Scripts Disponíveis

- `npm run start` - Inicia a aplicação
- `npm run start:dev` - Inicia a aplicação em modo de desenvolvimento
- `npm run build` - Compila o projeto
- `npm run test` - Executa os testes

## Integração com o Frontend

### Autenticação

**Login**
`POST /auth/login`

```json
{
  "username": "seu_usuario",
  "password": "sua_senha"
}
```

**Resposta:**

```json
{
  "access_token": "<token_jwt>"
}
```

**Todas as rotas protegidas exigem o header:**

```
Authorization: Bearer <token_jwt>
```

### Livros

**Listar todos os livros**
`GET /livro`
**Resposta:**

```json
[
  {
    "id": 1,
    "name": "Dom Casmurro",
    "author": "Machado de Assis",
    "coverUrl": "https://books.google.com/cover.jpg",
    "yearPublished": 1899,
    "status": "Lendo",
    "genre": { "id": 1, "name": "Romance" }
  }
]
```

**Criar livro**
`POST /livro`

```json
{
  "name": "Livro Teste",
  "author": "Autor Teste",
  "yearPublished": 2025,
  "status": "Quero",
  "genreId": 1
}
```

**Resposta inclui o campo `coverUrl` automaticamente buscado na Google Books API.**

**Buscar livro por ID**
`GET /livro/:id`

**Atualizar livro**
`PUT /livro/:id`

**Remover livro**
`DELETE /livro/:id`

### Gêneros

`GET /genero` — Lista todos os gêneros

### Usuários

`GET /usuario` — Lista todos os usuários

### Wishlist

`GET /wishlist` — Lista a wishlist do usuário autenticado

### Observações

- O campo `coverUrl` dos livros pode ser usado para exibir a capa no frontend.
- Consulte o backend para mais detalhes ou endpoints específicos.

## Padrão de Código e Boas Práticas

- Utilização de DTOs para validação de dados.
- Separação de responsabilidades por módulos.
- Uso de Guards e Strategies para autenticação.
- Testes automatizados em `test/`.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

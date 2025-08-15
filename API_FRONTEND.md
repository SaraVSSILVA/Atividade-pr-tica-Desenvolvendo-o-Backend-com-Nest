# LETRÁRIO - Guia de Integração para o Frontend

## Autenticação

### Login

**Endpoint:** `POST /auth/login`

**Body:**

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

---

## Livros

### Listar todos os livros

**Endpoint:** `GET /livro`
**Headers:**

```
Authorization: Bearer <token_jwt>
```

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
  // ...
]
```

### Criar um livro

**Endpoint:** `POST /livro`
**Headers:**

```
Authorization: Bearer <token_jwt>
```

**Body:**

```json
{
  "name": "Livro Teste",
  "author": "Autor Teste",
  "yearPublished": 2025,
  "status": "Quero",
  "genreId": 1
}
```

**Resposta:**

```json
{
  "id": 2,
  "name": "Livro Teste",
  "author": "Autor Teste",
  "coverUrl": "https://books.google.com/cover.jpg",
  "yearPublished": 2025,
  "status": "Quero",
  "genre": { "id": 1, "name": "Romance" }
}
```

### Buscar livro por ID

**Endpoint:** `GET /livro/:id`
**Headers:**

```
Authorization: Bearer <token_jwt>
```

**Resposta:**

```json
{
  "id": 2,
  "name": "Livro Teste",
  "author": "Autor Teste",
  "coverUrl": "https://books.google.com/cover.jpg",
  "yearPublished": 2025,
  "status": "Quero",
  "genre": { "id": 1, "name": "Romance" }
}
```

### Atualizar livro

**Endpoint:** `PUT /livro/:id`
**Headers:**

```
Authorization: Bearer <token_jwt>
```

**Body:**

```json
{
  "name": "Livro Atualizado",
  "author": "Autor Teste",
  "yearPublished": 2026,
  "status": "Lido",
  "genreId": 1
}
```

### Remover livro

**Endpoint:** `DELETE /livro/:id`
**Headers:**

```
Authorization: Bearer <token_jwt>
```

---

## Gêneros

### Listar gêneros

**Endpoint:** `GET /genero`
**Headers:**

```
Authorization: Bearer <token_jwt>
```

**Resposta:**

```json
[
  { "id": 1, "name": "Romance" },
  { "id": 2, "name": "Fantasia" }
]
```

---

## Usuários

### Listar usuários

**Endpoint:** `GET /usuario`
**Headers:**

```
Authorization: Bearer <token_jwt>
```

**Resposta:**

```json
[
  { "id": 1, "username": "leitor_exemplo" }
  // ...
]
```

---

## Wishlist

### Listar wishlist do usuário

**Endpoint:** `GET /wishlist`
**Headers:**

```
Authorization: Bearer <token_jwt>
```

**Resposta:**

```json
[
  {
    "id": 1,
    "book": {
      "id": 2,
      "name": "Livro Teste",
      "coverUrl": "https://books.google.com/cover.jpg"
    }
  }
  // ...
]
```

---

## Observações

- Todos os endpoints (exceto login) exigem autenticação JWT.
- O campo `coverUrl` dos livros pode ser usado para exibir a capa no frontend.
- Os dados retornados podem variar conforme o cadastro e relacionamento das entidades.
- Consulte o backend para mais detalhes ou endpoints específicos.

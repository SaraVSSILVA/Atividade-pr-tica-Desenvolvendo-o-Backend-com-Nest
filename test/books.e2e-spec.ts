import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let createdBookId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Autentica e obtém um token JWT válido (ajuste conforme seu fluxo de login)
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'leitor_exemplo', password: 'senha@123' });
    console.log('LOGIN RESPONSE BODY:', loginResponse.body);
    jwtToken = loginResponse.body?.access_token || '';
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /books deve retornar status 200', async () => {
    const response = await request(app.getHttpServer())
      .get('/books')
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /livro deve criar um livro com coverUrl', async () => {
    const book = {
      name: 'Livro Teste',
      author: 'Autor Teste',
      yearPublished: 2025,
      status: 'Quero',
      genreId: 1,
    };
    const response = await request(app.getHttpServer())
      .post('/livro')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(book);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('coverUrl');
    expect(
      typeof response.body.coverUrl === 'string' ||
      response.body.coverUrl === null,
    ).toBe(true);
    createdBookId = response.body.id;
  });

  it('GET /books/:id deve retornar o livro criado', async () => {
    const response = await request(app.getHttpServer())
      .get(`/books/${createdBookId}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdBookId);
  });

  it('PUT /books/:id deve atualizar o livro', async () => {
    const update = {
      title: 'Livro Atualizado',
      author: 'Autor Teste',
      year: 2026,
    };
    const response = await request(app.getHttpServer())
      .put(`/books/${createdBookId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(update);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Livro Atualizado');
  });

  it('DELETE /books/:id deve remover o livro', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/books/${createdBookId}`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(response.status).toBe(204);
  });

  it('GET /books/:id com id inexistente deve retornar 404', async () => {
    const response = await request(app.getHttpServer())
      .get(`/books/999999`)
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(response.status).toBe(404);
  });
});

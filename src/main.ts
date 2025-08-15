import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Configuração do Swagger ---
  const config = new DocumentBuilder()
    .setTitle('Catálogo de Livros API') //
    .setDescription('API para gerenciar um catálogo de livros') // Descrição da API
    .setVersion('1.0') // Versão da API
    // Adiciona a autenticação Bearer para o Swagger
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' é a rota onde a documentação estará

  // --- Habilitar CORS ---
  // Se você for usar um frontend, é crucial habilitar o CORS.
  app.enableCors();

  await app.listen(3000);
}

void bootstrap();

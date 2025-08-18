import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Importa o ConfigService
import { UserService } from '../users/services/User.Service';
import { UserEntity } from '../users/entities/User';

export async function createAdminUser(app: INestApplicationContext) {
  const usersService = app.get(UserService);
  const configService = app.get(ConfigService); // Obtém o serviço de configuração

  // Lê as credenciais das variáveis de ambiente
  const adminUsername = configService.get<string>('ADMIN_USERNAME');
  const adminPassword = configService.get<string>('ADMIN_PASSWORD');

  if (!adminUsername || !adminPassword) {
    console.error(
      'As variáveis de ambiente ADMIN_USERNAME e ADMIN_PASSWORD não estão definidas. A criação do usuário admin foi ignorada.',
    );
    return;
  }

  // Use o método findByUser para verificar se o usuário admin já existe
  const adminExists = await usersService.findByUser(adminUsername);

  if (!adminExists) {
    const adminUser = new UserEntity();
    adminUser.username = adminUsername;
    adminUser.password = adminPassword;
    // ATENÇÃO: Adicione a propriedade 'role' à sua UserEntity
    // Exemplo: adminUser.role = 'ADMIN';

    await usersService.create(adminUser);
    console.log(`Usuário administrador '${adminUsername}' criado com sucesso!`);
  } else {
    console.log(
      `Usuário administrador '${adminUsername}' já existe. Nenhuma ação necessária.`,
    );
  }
}

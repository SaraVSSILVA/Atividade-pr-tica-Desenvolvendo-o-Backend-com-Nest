import { INestApplicationContext } from '@nestjs/common';
import { UserEntity } from '../users/entities/User';
import { UserService } from '../users/services/User.Service';

export async function createAdminUser(app: INestApplicationContext) {
  const usersService = app.get(UserService);

  // Use o método findByUser para verificar se o usuário admin já existe
  const adminExists = await usersService.findByUser('admin');

  if (!adminExists) {
    // Crie uma nova instância da sua entidade de usuário
    const adminUser = new UserEntity();
    adminUser.username = 'admin';
    adminUser.password = 'senha_super_secreta_123';
    // ATENÇÃO: Adicione a propriedade 'role' à sua UserEntity
    // Este campo é crucial para a nossa lógica de permissões
    // Exemplo: adminUser.role = 'ADMIN';

    await usersService.create(adminUser);
    console.log('Usuário administrador criado com sucesso!');
  } else {
    console.log('Usuário administrador já existe. Nenhuma ação necessária.');
  }
}

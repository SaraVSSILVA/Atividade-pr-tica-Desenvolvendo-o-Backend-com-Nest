import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/User';
import { UserService } from './services/User.Service';
import { UserController } from './controllers/User.Controller';
import { BcryptModule } from '../auth/bcrypt/bcrypt.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    BcryptModule,
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, JwtAuthGuard],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

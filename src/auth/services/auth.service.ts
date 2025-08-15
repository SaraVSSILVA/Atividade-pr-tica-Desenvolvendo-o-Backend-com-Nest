/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bcrypt } from '../bcrypt/bcrypt';
import { UserService } from '../../users/services/User.Service';
import { LoginDto } from '../dto/Login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const searchUser = await this.userService.findByUser(username);

    if (!searchUser)
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);

    const matchPassword = await this.bcrypt.comparePassword(
      password,
      searchUser.password,
    );

    if (searchUser && matchPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...answer } = searchUser;
      return answer;
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new HttpException(
        'Credenciais inválidas.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // O payload do token JWT deve incluir informações úteis.
    const payload = { sub: user.id, username: user.username };

    return {
      access_token: this.jwtService.sign(payload),
      usuarioId: user.id,
      username: user.username,
    };
  }
}

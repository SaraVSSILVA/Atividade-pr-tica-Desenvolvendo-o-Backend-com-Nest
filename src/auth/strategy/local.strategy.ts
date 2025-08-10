/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import { PassportStrategy } from '@nestjs/passport';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private _usernameField: string;
  private _passwordField: string;

  constructor(private readonly authService: AuthService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super();
    this._usernameField = 'username';
    this._passwordField = 'password';
  }

  async validate(username: string, password: string): Promise<any> {
    const validaUser = await this.authService.validateUser(username, password);
    if (!validaUser) {
      throw new UnauthorizedException('Incorrect username and/or password!');
    }
    return validaUser;
  }
}

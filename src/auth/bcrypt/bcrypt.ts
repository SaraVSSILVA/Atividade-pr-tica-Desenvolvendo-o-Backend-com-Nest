import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {
  async encryptPassword(password: string): Promise<string> {
    const salts: number = 10;
    return await bcrypt.hash(password, salts);
  }

  async comparePassword(
    passwordEntered: string,
    passwordBank: string,
  ): Promise<boolean> {
    return await bcrypt.compare(passwordEntered, passwordBank);
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {
  async encryptPassword(password: string): Promise<string> {
    const salts: number = 10;
    try {
      if (typeof bcrypt.hash !== 'function') {
        throw new Error('bcrypt.hash is not a function');
      }
      return await bcrypt.hash(password, salts);
    } catch (error) {
      throw new Error(
        `Error encrypting password: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async comparePassword(
    passwordEntered: string,
    passwordBank: string,
  ): Promise<boolean> {
    try {
      if (typeof bcrypt.compare !== 'function') {
        throw new Error('bcrypt.compare is not a function');
      }
      const isMatch = await bcrypt.compare(passwordEntered, passwordBank);
      return isMatch;
    } catch (err) {
      throw new Error(
        `Error comparing passwords: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}

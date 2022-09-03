import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buff = await promisify(scrypt)(password, salt, 64) as Buffer;
    return `${buff.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, inputPassword: string): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split(".");
    const hashedInputPassword = await promisify(scrypt)(inputPassword, salt, 64) as Buffer;
    return hashedPassword === hashedInputPassword.toString('hex');
  }
};
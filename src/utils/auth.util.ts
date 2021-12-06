import * as bcrypt from 'bcrypt';
import commonConfig from 'src/config/common.config';

export function hashPassword(password: string) {
  return bcrypt.hash(password, commonConfig().auth.password_salt_rounds);
}

export function doPasswordsMatch(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

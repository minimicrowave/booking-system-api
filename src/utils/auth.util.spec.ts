import { doPasswordsMatch, hashPassword } from './auth.util';
import * as bcrypt from 'bcrypt';

describe('Auth Utils', () => {
  const password = 'password';
  const hashedPassword =
    '$2b$10$GG6MCuc8lWPPOR5RYeqmdewy7mnfMWFJUb8xXm1evENQZSHy/clXy';

  describe('hashPassword()', () => {
    it('should return hashed password', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(hashedPassword);
      expect(await hashPassword(password)).toBe(hashedPassword);
    });
  });

  describe('doPasswordsMatch', () => {
    it('should return true if plain text and hashed password matches', async () => {
      expect(await doPasswordsMatch(password, hashedPassword)).toBe(true);
    });
  });
});

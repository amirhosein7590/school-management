import { hash, compare } from "bcrypt";

export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(originalPass, hashedPass) {
  const isValidPassword = await compare(originalPass, hashedPass);
  return isValidPassword;
}

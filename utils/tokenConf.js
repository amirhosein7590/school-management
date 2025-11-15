import { sign, verify } from "jsonwebtoken";

export function generateToken(data) {
  const token = sign(data, process.env.jwtSignature, {
    expiresIn: "24h",
  });
  return token;
}

export function generateRefreshToken(data) {
  const refreshToken = sign(data, process.env.jwtSignature, {
    expiresIn: "7d",
  });
  return refreshToken;
}

export function verifyToken(token) {
  if (!token) return false;

  try {
    const validationResult = verify(token, process.env.jwtSignature);
    return validationResult;
  } catch (error) {
    return false;
  }
}

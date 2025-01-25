import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

interface IJwtPayload {
  email: string;
  role: string;
}

export const createToken = (
  jwtPayload: IJwtPayload,
  secret: Secret,
  expiresIn: string,
): string => {
  return jwt.sign(jwtPayload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};

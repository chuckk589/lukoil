export type JWTTokenPayload = {
  id: number;
  phone: string;
  iat: number;
  exp: number;
};

export type RequestWithUser = Request & { user: JWTTokenPayload };

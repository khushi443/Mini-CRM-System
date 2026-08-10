import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey', // ⚠️ same as auth.module
    });
  }

  async validate(payload: any) {
    console.log("JWT PAYLOAD:", payload); // 🔥 debug

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
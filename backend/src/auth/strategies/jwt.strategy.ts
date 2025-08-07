import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadType } from "../types/payload.type";
import configuration from "src/config/configuration";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, 
            secretOrKey: configuration().jwtSecret
        });
    }

    //  When applying @AuthGuard('jwt'), the validate function will be called automatically
    async validate(payload: PayloadType) {
        const user = await this.usersService.findById(payload.userId);
        // if refresh token is null then user is logged out
        if(user?.refreshToken)
            return {
                userId: payload.userId,
                email: payload.email,
                username: payload.username
            }
        else
            throw new HttpException('Access Denied',HttpStatus.FORBIDDEN);
    }
}
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JWTStrategy } from "./strategies/jwt.strategy";
import { RefreshTokenStratey } from "./strategies/refresh-token.strategy";
import { AlbumsModule } from "src/albums/albums.module";

@Module({
    imports:[
        PassportModule,
        UsersModule,
        AlbumsModule
    ],
    controllers: [AuthController],
    providers:[AuthService, JWTStrategy, RefreshTokenStratey],
    exports: [AuthService]
})

export class AuthModule {}
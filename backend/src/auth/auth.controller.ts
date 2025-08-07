import { Body, Controller, Get, Post, Req, Request, UseGuards } from "@nestjs/common";
import { CreateUserDTO } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { LoginUserDTO } from "./dto/login-user.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RefreshTokenGuard } from "src/guards/jwt-refresh.guard";

@Controller("auth")
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ){}

    @Post("signup")
    signup(@Body() createUserDto:CreateUserDTO) {
        return this.authService.signup(createUserDto);
    }

    @Post("login")
    login(@Body() loginUserDto:LoginUserDTO) {
        return this.authService.login(loginUserDto);
    }

    @Get('logout')
    @UseGuards(JwtAuthGuard)
    logout(@Request() req) {
        this.authService.logout(req.user.userId)
    }

    @Get('refreshToken')
    @UseGuards(RefreshTokenGuard)
    refreshToken(@Request() req) {
        return this.authService.refreshToken(req.user.userId, req.user.refreshToken)
    }
    
}
import { Body, Controller, Get, Request, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";

@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get("all")
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.usersService.findAll();
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getUsersProfile(@Request() req) {
        return this.usersService.findById(req.user.userId, 'email username');
    }
}
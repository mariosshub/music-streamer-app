import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginUserDTO } from "./dto/login-user.dto";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcryptjs";
import { PayloadType } from "./types/payload.type";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDTO } from "src/users/dto/create-user.dto";
import { ConfigService } from "@nestjs/config";
import { ClientSession, Connection, Types } from "mongoose";
import { UserDocument } from "src/users/schemas/user";
import { AuthResponseType } from "./dto/authResponseType";
import { AlbumsService } from "src/albums/albums.service";
import { InjectConnection } from "@nestjs/mongoose";

@Injectable()
export class AuthService {

    constructor(
        @InjectConnection()
        private readonly connection: Connection,
        private jwtService: JwtService,
        private configService: ConfigService,
        private usersService: UsersService,
        private albumsService: AlbumsService
    ){}

    async signup(createUserDto: CreateUserDTO): Promise<AuthResponseType> {
        const userExists = await this.usersService.findByEmailOrUsername(createUserDto.email, createUserDto.username);
        if(userExists)
            throw new BadRequestException("User exists");

        const session = await this.connection.startSession();
        try {
            session.startTransaction();

            // hash the password and save the user
            const salt = await bcrypt.genSalt();
            createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

            const newUser = await this.usersService.create(createUserDto, session);

            //create default album for user on signup
            await this.albumsService.createDefaultAlbum(newUser[0]._id.toString(), session)
            
            let tokens = await this.createPayloadAndTokens(newUser[0], null, session);

            await session.commitTransaction();

            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                id: newUser[0]._id.toString(),
                username: newUser[0].username,
                email: newUser[0].email
            }
        } catch (error) {
            await session.abortTransaction();
            throw error
        } finally {
            session.endSession()
        }
    }

    async login(loginUserDto: LoginUserDTO): Promise<AuthResponseType> {
        const user = await this.usersService.findByUsername(loginUserDto.username)

        //  compare login user password with db encrypted password
        const passwordMatched = await bcrypt.compare(loginUserDto.password, user.password);
        if(!passwordMatched)
            throw new UnauthorizedException("Password is invalid");
        
        let tokens = await this.createPayloadAndTokens(user);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            id: user._id.toString(),
            username: user.username,
            email: user.email
        }
    }

    async logout(userId: string) {
        await this.usersService.updateRefreshToken(new Types.ObjectId(userId), null);
    }

    async refreshToken(userId: string, refreshToken: string): Promise<{accessToken: string, refreshToken: string}> {
        const user = await this.usersService.findById(userId);
        if (!user.refreshToken)
            throw new HttpException('Access Denied',HttpStatus.FORBIDDEN);

        const refreshTokenMatches = await bcrypt.compare(
            refreshToken,
            user.refreshToken,
        );
        if (!refreshTokenMatches) 
            throw new HttpException('Access Denied',HttpStatus.FORBIDDEN);
    
        return this.createPayloadAndTokens(user, refreshToken);
    }

    async createPayloadAndTokens(user: UserDocument, refreshToken: string | null = null, session: ClientSession | null = null): Promise<{accessToken: string, refreshToken:string}>  {
        // create the payload and sign tokens
        const payload: PayloadType = {userId: user._id.toString(), username: user.username, email: user.email};
        const tokens = await this.signTokensAndReturn(payload);
        
        // hash and update the refresh token of the user
        let hashedRefreshToken:string;
        const salt = await bcrypt.genSalt();
        if(refreshToken)
            hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
        else
            hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, salt);

        if(session)
            await this.usersService.updateRefreshTokenWithSession(user._id, hashedRefreshToken, session);
        else
            await this.usersService.updateRefreshToken(user._id, hashedRefreshToken);

        return tokens;
    }

    async signTokensAndReturn(payload: PayloadType) {
        const [accessToken, refreshToken] = await Promise.all(
            [this.jwtService.signAsync(
                payload,
                {   
                    secret: this.configService.get('jwtSecret'),
                    expiresIn: '20m'
                }
            ),
            this.jwtService.signAsync(
                payload,
                {
                    secret: this.configService.get('refreshSecret'),
                    expiresIn: '1d'
                }
            )]
        )
        return {
            accessToken,
            refreshToken
        }
    }
    
}
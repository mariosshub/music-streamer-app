import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user";
import { ClientSession, Model, Types } from "mongoose";
import { CreateUserDTO } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>
    ){}

    async findAll(): Promise<User[]> {
        return this.userModel.find();
    }

    // use projection in order to include specific fields in the response (ex. email username)
    async findById(userId: string, projection: string | null = null){
        return await this.userModel.findById(new Types.ObjectId(userId), projection)
            .orFail(() => new HttpException("User not found", HttpStatus.NOT_FOUND));
    }

    async findByEmailOrUsername (email: string, username: string) {
        return await this.userModel.findOne({$or: [{email: email}, {username: username}]})
    }

    async findByUsername(username:string): Promise<UserDocument> {
        return await this.userModel.findOne({username})
            .orFail(() => new HttpException("User not found", HttpStatus.NOT_FOUND));
    }

    async create(userDto: CreateUserDTO, session: ClientSession) : Promise<UserDocument[]> {
        return await this.userModel.create([userDto], {session});
    }

    async updateRefreshToken(userId: Types.ObjectId, refreshToken: string | null){
        return await this.userModel.updateOne({_id:userId}, {refreshToken: refreshToken})
        .orFail(() => new HttpException("User not found", HttpStatus.NOT_FOUND));
    }

    async updateRefreshTokenWithSession(userId: Types.ObjectId, refreshToken: string | null, session: ClientSession){
        return await this.userModel.updateOne({_id:userId}, {refreshToken: refreshToken}, {session})
            .orFail(() => new HttpException("User not found", HttpStatus.NOT_FOUND));
    }
}
import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { Types } from "mongoose";
import { User } from "src/users/schemas/user";

export class RecentlyReleasedSongDTO {
    @IsString()
    @IsNotEmpty()
    _id: string

    @IsString()
    @IsNotEmpty()
    title:string;

    @IsObject()
    @IsNotEmpty()
    artist:User;

    @IsString()
    @IsNotEmpty()
    minutesFromUpload: string;
}
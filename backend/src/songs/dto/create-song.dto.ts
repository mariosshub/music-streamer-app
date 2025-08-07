import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateSongDTO {
    @IsString()
    @IsNotEmpty()
    title:string;

    @IsObject()
    @IsNotEmpty()
    artist:Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    releasedDate: string;

    @IsString()
    @IsNotEmpty()
    uploadDate: string;

    @IsNumber()
    @IsNotEmpty()
    durationInSec: number;

    @IsString()
    genre: string;

    @IsNotEmpty()
    uploadedSongId: Types.ObjectId

    @IsArray()
    @IsNotEmpty()
    album: Types.ObjectId
}
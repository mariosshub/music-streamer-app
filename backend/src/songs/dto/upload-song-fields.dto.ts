import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UploadSongFieldsDTO {
    @IsString()
    @IsNotEmpty()
    title:string;

    @IsString()
    @IsNotEmpty()
    releasedDate: string;

    @IsString()
    @IsNotEmpty()
    durationInSec: string;

    @IsString()
    @IsNotEmpty()
    album:string;

    @IsString()
    @IsNotEmpty()
    genre:string;
}
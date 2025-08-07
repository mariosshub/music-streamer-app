import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateAlbumDTO {
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsNumber()
    @IsNotEmpty()
    releasedYear: number;
}
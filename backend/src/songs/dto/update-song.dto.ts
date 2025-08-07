import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateSongDTO {
        @IsString()
        @IsNotEmpty()
        releasedDate: string;

        @IsString()
        @IsNotEmpty()
        album: string

        @IsString()
        @IsNotEmpty()
        genre: string;
}
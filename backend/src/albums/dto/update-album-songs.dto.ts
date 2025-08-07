import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdateAlbumSongsDTO {
    @IsString()
    @IsNotEmpty()
    albumId: string;

    @IsArray()
    @IsNotEmpty()
    songs: string[]
}
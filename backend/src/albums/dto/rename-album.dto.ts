import { IsNotEmpty, IsString } from "class-validator";

export class RenameAlbumDTO {
    @IsString()
    @IsNotEmpty()
    id: string;
    @IsString()
    @IsNotEmpty()
    title: string;
}
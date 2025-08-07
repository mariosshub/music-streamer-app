import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateSongLikesDTO {
    @IsNumber()
    @IsNotEmpty()
    likes: number;
}
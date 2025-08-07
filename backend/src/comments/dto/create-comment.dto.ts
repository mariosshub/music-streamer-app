import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDTO {
    @IsString()
    @IsNotEmpty()
    songId: string;

    @IsString()
    @IsNotEmpty()
    message: string;
}
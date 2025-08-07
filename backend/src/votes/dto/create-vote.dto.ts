import { IsNotEmpty, IsString } from "class-validator";

export class CreateVoteDTO {
    @IsString()
    @IsNotEmpty()
    songId: string
}
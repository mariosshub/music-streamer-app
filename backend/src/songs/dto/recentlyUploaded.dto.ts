import { User } from "src/users/schemas/user";

export class RecentlyUploadedDTO {
    _id: string;
    title: string;
    artist: User;
    minutesDiff: number;
    uploadedSongId: string
}
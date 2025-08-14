import { Types } from "mongoose"

export interface MulterMusicFile {
    id: Types.ObjectId,
    filename: string
    contentType: string
    size: number
}
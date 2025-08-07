import { Types } from "mongoose"

export interface MulterMusicFile {
    originalname: string
    encoding: string
    mimetype: string,
    id: Types.ObjectId,
    filename: string
    metadata: string,
    bucketName: string,
    chunkSize: number,
    size: number,
    md5: string,
    uploadDate: Date,
    contentType: string
}
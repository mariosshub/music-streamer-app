import { CommentsModel } from "./Comments"
import { UserModel } from "./User"

export type SongModel = {
    _id: string,
    title: string,
    artist: UserModel,
    releasedDate: string,
    uploadDate: string,
    durationInSec: number,
    uploadedSongId: string,
    album: string,
    genre: string
    comments: string[],
    votes: number
}

export type CreateSongModel = {
    title: string,
    releasedDate: Date,
    durationInSec: string,
    album: string,
    genre: string
}

export type EditSongModel = {
    releasedDate: Date,
    album: string,
    genre: string
}

export type SongWithCommentsModel = {
    _id: string,
    title: string,
    artist: UserModel,
    releasedDate: string,
    uploadDate: string,
    durationInSec: number,
    uploadedSongId: string,
    album: string,
    genre: string
    comments: CommentsModel[],
    votes: number
}
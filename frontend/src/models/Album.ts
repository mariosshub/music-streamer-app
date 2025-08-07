import { SongModel } from "./Song"
import { UserModel } from "./User"

export type AlbumResponse = {
    _id: string,
    title: string,
    artist: string,
    releasedYear: string,
    songs: string[],
    isDefault: boolean
}

export type AlbumSearchResponse = {
    _id: string,
    title: string,
    artist: UserModel,
    releasedYear: string,
    songs: string[],
    isDefault: boolean
}

export type AlbumPopulatedSongs = {
    _id: string,
    title: string,
    artist: UserModel,
    releasedYear: string,
    songs: SongModel[],
    isDefault: boolean
}

export type CreateAlbum = {
    title: string,
    releasedYear: number
}

export type RenameAlbum = {
    id: string,
    title: string
}
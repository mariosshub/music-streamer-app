import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Album, AlbumDocument } from "./schemas/album";
import { ClientSession, Connection, Model, Types } from "mongoose";
import { CreateAlbumDTO } from "./dto/create-album.dto";
import { Song, SongDocument } from "src/songs/schemas/song";
import { UpdateAlbumSongsDTO } from "./dto/update-album-songs.dto";
import { User } from "src/users/schemas/user";
import { RenameAlbumDTO } from "./dto/rename-album.dto";
import { SongsService } from "../songs/songs.service";

@Injectable()
export class AlbumsService {
    constructor(
        @InjectModel(Album.name)
        private readonly albumModel: Model<AlbumDocument>,
        @InjectConnection()
        private readonly connection: Connection,
        // used forward reference to solve circular depedency
        @Inject(forwardRef(() => SongsService))
        private songsService: SongsService
    )
    {}

    async getAllAlbumsOfUser(userId: string): Promise<AlbumDocument[]> {
        return await this.albumModel.find({artist: new Types.ObjectId(userId)})
            // sort album by the recent releasedYear first
            .sort({releasedYear: -1})
            .orFail(new HttpException('No albums found for user', HttpStatus.NOT_FOUND));
    }

    async searchAlbum (limit: number, skip: number, album: string, artist: string) {
        return await this.albumModel.aggregate([
            { $match: { title: { $regex: album, $options:'i' } } },
            // works like populate function
            {
                $lookup: {
                from: 'users', // This refers to the MongoDB collection 'users' mongo maps the collection to plural by default
                localField: 'artist',
                foreignField: '_id',
                as: 'artist'
                }
            },
            { $unwind: '$artist' },
            { $match: { 'artist.username': { $regex: artist, $options:'i' } } },
            { $skip: skip},
            { $limit: limit},
        ])
    }

    // create a default album to save the song into
    // or return the existing default.
    async createDefaultAlbum (userId: string): Promise<AlbumDocument> {
       let defaultAlbum: AlbumDocument | null = await this.albumModel.findOne({isDefault: true, artist: new Types.ObjectId(userId)})

       if(!defaultAlbum){
            console.log('Creating default album My songs');
            return await this.albumModel.create({
                title: 'My songs',
                artist: new Types.ObjectId(userId),
                releasedYear: new Date().getFullYear(),
                songs: [],
                isDefault: true
            })
       }
       else
        return defaultAlbum;
    }

    async createAlbum(createAlbumDto:CreateAlbumDTO, userId: string) {
        // check album title and artist should not exist
        let albumFound = await this.albumModel.findOne({title: createAlbumDto.title, artist: new Types.ObjectId(userId)})
        if(albumFound)
            return new HttpException('Album with the same name exists', HttpStatus.INTERNAL_SERVER_ERROR)

        return await this.albumModel.create({
            title: createAlbumDto.title,
            artist: new Types.ObjectId(userId),
            releasedYear: createAlbumDto.releasedYear,
            songs: [],
            isDefault: false
        })
    }

    async renameAlbum(renameAlbumDto: RenameAlbumDTO, userId: string) {
        await this.albumModel.findOneAndUpdate(
            {_id: new Types.ObjectId(renameAlbumDto.id), artist: new Types.ObjectId(userId)},
            {title: renameAlbumDto.title}
        ).orFail(new HttpException('Album not found', HttpStatus.NOT_FOUND));
    }

    async updateSongsArray (album: AlbumDocument, songId: Types.ObjectId, session: ClientSession) {
       let result = await this.albumModel.updateOne(
            {_id: album._id},
            {$push: {songs: songId}},
            {session}
        ).orFail(new HttpException('Album not found', HttpStatus.NOT_FOUND));

        if(result.modifiedCount === 0) 
            throw new HttpException('Error inserting song to album', HttpStatus.INTERNAL_SERVER_ERROR)
        return result;
    }

    async deleteAlbumsSong (songId: string, albumId: Types.ObjectId, session: ClientSession) {
        let result = await this.albumModel.updateOne(
            {_id: albumId},
            {$pull: {songs: new Types.ObjectId(songId)}},
            {session}
        ).orFail(new HttpException('Album not found', HttpStatus.NOT_FOUND));

         if(result.modifiedCount === 0) 
            throw new HttpException('No song found to delete from album', HttpStatus.NOT_FOUND)
        return result;
    }

    // deletes the album and the songs that belong to it permenately
    // the same song should not exist to another album
    async deleteAlbum(albumId: string, userId: string) {
        let albumToDelete =  await this.albumModel.findOne({   
                _id: new Types.ObjectId(albumId),
                artist: new Types.ObjectId(userId), 
                // should not delete the default album
                isDefault: {$ne: true}
        }).populate<{songs: SongDocument[]}>('songs')
        .orFail(new HttpException('Album not found or tried to delete default album', HttpStatus.NOT_FOUND));

        const session = await this.connection.startSession();
        try {
            session.startTransaction();
            // delete each song
            await this.songsService.deleteMultipleSongs(albumToDelete.songs, session);

            // delete the album
            await this.albumModel.deleteOne({_id: albumToDelete._id}, {session});
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error

        } finally {
            session.endSession();
        }
    }

    async getAlbumPopulateSongs (albumId: string) {
        return await this.albumModel.findById(new Types.ObjectId(albumId))
        // sort songs of album by most recently released first
        .populate<{songs: Song[]}>({path: 'songs', populate: {path: 'artist'}, options:{sort:{releasedDate: -1}}})
        .populate<{artist: User}>('artist')
        .orFail(new HttpException('Album not found', HttpStatus.NOT_FOUND));
    }

    async getUsersAlbum(albumId: string, userId: string): Promise<AlbumDocument> {
        return await this.albumModel.findOne({_id: new Types.ObjectId(albumId), artist: new Types.ObjectId(userId)})
            .orFail(new HttpException('Album not found', HttpStatus.NOT_FOUND));
    }
}
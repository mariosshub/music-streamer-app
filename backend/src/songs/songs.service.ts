import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Song, SongDocument } from "./schemas/song";
import { Connection, Model, Types } from "mongoose";
import { MongoGridFS } from "mongo-gridfs";
import { GridFSBucketReadStream } from "mongodb";
import { CreateSongDTO } from "./dto/create-song.dto";
import { MulterMusicFile } from "./multer/multer-file.types";
import { UpdateSongDTO } from "./dto/update-song.dto";
import { AlbumsService } from "../albums/albums.service";
import { Comment } from "src/comments/schemas/comment";
import { User } from "src/users/schemas/user";
import { UploadSongFieldsDTO } from "./dto/upload-song-fields.dto";
import { SocketService } from "src/socket/socket.service";
import { VotesService } from "src/votes/votes.service";
import { MostLikedSongsResponse } from "src/votes/dto/most-liked-songs";

@Injectable()
export class SongsService {
    private songGridFs: MongoGridFS;

    constructor(
        @InjectModel(Song.name)
        private readonly songModel: Model<SongDocument>,
        @InjectConnection()
        private readonly connection: Connection,
        @Inject(forwardRef(() => AlbumsService))
        private albumsService: AlbumsService,
        private socketService: SocketService
    ){
        this.songGridFs = new MongoGridFS(this.connection.db as any, 'fs')
    }

    async findAll(): Promise<Song[]> {
        return this.songModel.find();
    }

    async findSongByIdPopulateComments(songId: string): Promise<SongDocument> {
        return await this.songModel.findById(new Types.ObjectId(songId))
        .populate<{artist: User}>('artist')
        // sort by fetching most recent comments last
        .populate<{comments: Comment[]}>({path: 'comments', populate: {path: 'sender'}, options:{sort:{createdAt: 1}}})
        .orFail(() => new HttpException("Could not find song", HttpStatus.NOT_FOUND));
    }

    async findSongsByUsersId(userId: string): Promise<SongDocument[]> {
        // sort by most recently released
        return await this.songModel.find({artist: new Types.ObjectId(userId)}).sort({releasedDate: -1})
            .orFail(() => new HttpException("No songs found for user", HttpStatus.NOT_FOUND));
    }

    async getSongByTitleAndArtist(title: string, artist:string): Promise<SongDocument | null> {
        return await this.songModel.findOne({title: title, artist: new Types.ObjectId(artist)});
    }
 
    async getTop5SongsAmongUsers(): Promise<SongDocument[]> {
        return await this.songModel.find()
            .sort({votes: -1})
            .limit(5)
            .populate<{artist: User}>('artist')
            .orFail(() => new HttpException("No songs found", HttpStatus.NOT_FOUND));
    }

    async getTopSongsByGenre(genre: string): Promise<SongDocument[]> {
        return await this.songModel.find({genre: genre})
            .sort({votes: -1})
            .limit(8)
            .populate<{artist: User}>('artist')
            .orFail(() => new HttpException("No songs found", HttpStatus.NOT_FOUND));
    }

    async getSongsByGenre(genre: string, limit: number | undefined, skip: number | undefined) : Promise<SongDocument[]> {
        if(limit && skip){
            return await this.songModel.find({genre: genre}) // inlude also the logged in users songs
            .limit(limit)
            .skip(skip)
            .populate<{artist: User}>('artist')
            .orFail(() => new HttpException("No songs found", HttpStatus.NOT_FOUND))
        }       
        else
            return await this.songModel.find({genre: genre})
                .populate<{artist: User}>('artist')
                .orFail(() => new HttpException("No songs found", HttpStatus.NOT_FOUND));
    }

    async groupSongsByGenre(userId: string) {
        return await this.songModel.aggregate([
            {
                $group: {_id: "$genre"}
            }
        ])
    }

    // gets the uploaded songs of any user within an hour
    async getRecentlyReleasedSongs(): Promise<SongDocument[]> {
        let lastHour = new Date();
        lastHour.setHours(lastHour.getHours() - 1);
        return await this.songModel.find({uploadDate: {$gt: lastHour.toISOString()}})
            .sort({uploadDate: -1})
            .limit(8)
            .populate<{artist: User}>('artist')
            .orFail(() => new HttpException("No songs found", HttpStatus.NOT_FOUND));
    }

    async uploadSong(file: MulterMusicFile, body:UploadSongFieldsDTO, userId: string) {
        console.log('------- File Upload -------')
        console.log(file);
        let {title, releasedDate, durationInSec, album, genre} = body;

        //check if album exists 
        if(!album || album == "0")
            throw new HttpException('No album provided', HttpStatus.INTERNAL_SERVER_ERROR);

        // check if user has song with same title
        let songFound = await this.getSongByTitleAndArtist(title, userId);
        if(songFound)
            throw new HttpException('Song with same title found!', HttpStatus.INTERNAL_SERVER_ERROR);

        let albumToInsertSong = await this.albumsService.getUsersAlbum(album, userId);
    
        const createSongDto: CreateSongDTO = {
            artist: new Types.ObjectId(userId),
            title: title,
            releasedDate: releasedDate,
            uploadDate: file.uploadDate.toISOString(),
            durationInSec: parseInt(durationInSec),
            genre: genre,
            uploadedSongId: file.id,
            album: albumToInsertSong._id
        }
        let songDocument = await this.songModel.create(createSongDto);

        // set the song to album -> songs
        await this.albumsService.updateSongsArray(albumToInsertSong, songDocument._id)

        // return the recently uploaded song with socket
        this.socketService.socket.emit('recently_uploaded', songDocument)
        return songDocument;
    }

    // updates songs released date, genre and album
    async updateSong(songId: string, updateSongDto: UpdateSongDTO, userId: string): Promise<SongDocument> {
        let songToUpdate = await this.songModel.findOne({
             _id: new Types.ObjectId(songId), 
            artist: new Types.ObjectId(userId)
        }).orFail(() => new HttpException("Could not find song to update", HttpStatus.NOT_FOUND));

        //check if album exists
        let albumToInsertSong = await this.albumsService.getUsersAlbum(updateSongDto.album, userId);

        // here its best to use transactions and rollbacks but we dont have replica sets in local mongo (maybe for feature improvement)

        //check if its a different album from the one that was in
        // in order to remove from the one and add to the other
        if(songToUpdate.album.toString() !== albumToInsertSong._id.toString()){
            // update the album insert the updatedsong to songs array
            await this.albumsService.updateSongsArray(albumToInsertSong, songToUpdate._id)

            //remove the song from previous album
            await this.albumsService.deleteAlbumsSong(songToUpdate._id.toString(), songToUpdate.album)
            // update the album finally
            songToUpdate.album = albumToInsertSong._id;
        }

        songToUpdate.releasedDate = updateSongDto.releasedDate;
        songToUpdate.genre = updateSongDto.genre;

        return await songToUpdate.save();
    }

    async updateSongComments(songId: string, commentId: Types.ObjectId) {
        return await this.songModel.updateOne(
            {_id: new Types.ObjectId(songId)},
            {$push: {comments: commentId}}
        )
    }

    async increaseSongVotes(songId: string) {
        return await this.songModel.findByIdAndUpdate(new Types.ObjectId(songId), {$inc: {votes: 1}})
    }

    async decreaseSongVotes(songId: string) {
        return await this.songModel.findByIdAndUpdate(new Types.ObjectId(songId), {$inc: {votes: -1}})
    }

    async deleteSong(songId: string, userId: string) {
        // find the song and save the uploadedFileId
        let song = await this.songModel.findOne({_id: new Types.ObjectId(songId), artist: new Types.ObjectId(userId)})
            .orFail(() => new HttpException("Could not find song", HttpStatus.NOT_FOUND));
        let uploadedSongId = song.uploadedSongId;
        
        // here tried to use transactions and rollbacks but we dont have replica sets (maybe for feature improvement)

        // pull song from the album
        const albumsUpdateResult = await this.albumsService.deleteAlbumsSong(songId, song.album);

        console.log("Deleted song from album: ", albumsUpdateResult.modifiedCount);

        // delete the song document
        await this.songModel.deleteOne({_id: new Types.ObjectId(songId)})

        // delete from bucket
        await this.songGridFs.delete(uploadedSongId.toString());
    }

    async deleteMultipleSongs(songArray: SongDocument[], userId:string) {
        if(songArray.length == 0)
            return
        let songIdsToDelete = songArray.map(song => song._id);
        await this.songModel.deleteMany({_id: { $in: songIdsToDelete}});

        const promiseArr: Promise<boolean>[] = []

        // delete each song from bucket
        songArray.forEach(song => {
           let promise = this.songGridFs.delete(song.uploadedSongId.toString());
           promiseArr.push(promise);
        });

        return await Promise.all(promiseArr);
    }

    async readSongStream(id: string): Promise<GridFSBucketReadStream> {
        return await this.songGridFs.readFileStream(id);
    }

    async findSongInfo(id: string) {
        const fileInfo = await this.songGridFs.findById(id)
        .catch( err => {throw new HttpException('File not found', HttpStatus.NOT_FOUND)} )
        .then(result => result)
        return fileInfo;
    }
}
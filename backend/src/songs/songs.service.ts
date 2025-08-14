import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Song, SongDocument } from "./schemas/song";
import { Connection, Model, Types } from "mongoose";
import { CreateSongDTO } from "./dto/create-song.dto";
import { UpdateSongDTO } from "./dto/update-song.dto";
import { AlbumsService } from "../albums/albums.service";
import { Comment } from "src/comments/schemas/comment";
import { User } from "src/users/schemas/user";
import { UploadSongFieldsDTO } from "./dto/upload-song-fields.dto";
import { SocketService } from "src/socket/socket.service";
import { GridFSBucket } from 'mongodb';
import { MulterMusicFile } from "./multer/multer-file.types";

@Injectable()
export class SongsService {
    private bucket: GridFSBucket;

    constructor(
        @InjectModel(Song.name)
        private readonly songModel: Model<SongDocument>,
        @InjectConnection()
        private readonly connection: Connection,
        @Inject(forwardRef(() => AlbumsService))
        private albumsService: AlbumsService,
        private socketService: SocketService
    ){
        if(this.connection.db)
            this.bucket = new GridFSBucket(this.connection.db);
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

    async uploadFile(file: Express.Multer.File): Promise<MulterMusicFile> {
        const uploadStream = this.bucket.openUploadStream(file.originalname, {
            contentType: file.mimetype,
        });

        return new Promise((resolve, reject) => {
            const bufferStream = require('stream').Readable.from(file.buffer);
            bufferStream.pipe(uploadStream)
                .on('error', reject)
                .on('finish', () => {
                resolve({
                    id: uploadStream.id,
                    filename: file.originalname,
                    contentType: file.mimetype,
                    size: file.size
                });
            });
        });
    }

    async uploadSong(file: Express.Multer.File, body:UploadSongFieldsDTO, userId: string) {
        console.log('------- File Upload -------')
        console.log(file);
        let {title, releasedDate, durationInSec, album, genre} = body;

        // upload the file in a bucket
        let uploadedFile = await this.uploadFile(file)
        
        if(!uploadedFile){
            throw new HttpException('No album provided', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        console.log('file uploaded with id = ', uploadedFile.id)

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
            uploadDate: new Date().toISOString(),
            durationInSec: parseInt(durationInSec),
            genre: genre,
            uploadedSongId: uploadedFile.id,
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
        try {
            await this.bucket.delete(uploadedSongId);
        } catch (error) {
            throw new HttpException("File not found", HttpStatus.NOT_FOUND);
        }
    }

    async deleteMultipleSongs(songArray: SongDocument[], userId:string) {
        if(songArray.length == 0)
            return
        let songIdsToDelete = songArray.map(song => song._id);
        await this.songModel.deleteMany({_id: { $in: songIdsToDelete}});

        const promiseArr: Promise<void>[] = []

        // delete each song from bucket
        for(const song of songArray){
            const promise = this.bucket.delete(song.uploadedSongId).catch(error => {
                console.log(`Error deleting file ${song.uploadedSongId}: `, error);
                throw new HttpException("File not found", HttpStatus.NOT_FOUND);
            });
            promiseArr.push(promise);
        }

        return await Promise.all(promiseArr);
    }

    async getSongStream(id: string) {
        try{
            // First get the file info to access the filename
            const files = await this.bucket.find({ _id: new Types.ObjectId(id) }).toArray();

            if (!files.length) 
                throw new HttpException('File not found', HttpStatus.NOT_FOUND)

            const downloadStream = this.bucket.openDownloadStream(new Types.ObjectId(id));
            return {
                stream: downloadStream,
                contentLength: files[0].length
            };
        } catch (error) {
            throw new HttpException('Error in streaming song', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
}
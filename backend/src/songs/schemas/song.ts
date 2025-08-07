import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Album } from "src/albums/schemas/album";
import { Comment } from "src/comments/schemas/comment";
import { User } from "src/users/schemas/user";

export type SongDocument = HydratedDocument<Song>;

@Schema()
export class Song {

    @Prop({
        type: String,
        required: true
    })
    title: string;

    @Prop({
        type: Types.ObjectId,
        ref:"User",
        required: true
    })
    artist: User;

    @Prop({
        type: String,
        required: true,
    })
    releasedDate: string;

    @Prop({
        type: String,
        required: true,
    })
    uploadDate: string;

    @Prop({
        type: Number,
        required: true,
    })
    durationInSec: number;

    @Prop({
        type: String
    })
    genre: string;

    @Prop({
        type: Types.ObjectId,
        required: true
    })
    uploadedSongId: Types.ObjectId

    @Prop({
        type: Types.ObjectId,
        ref: Album.name
    })
    album: Types.ObjectId;

    @Prop({
        type: [Types.ObjectId],
        ref: "Comment"
    })
    comments: Comment[];

    @Prop({
        default: 0
    })
    votes: number;
}
export const SongSchema = SchemaFactory.createForClass(Song).index({title: 1, artist: 1}, {unique: true}); 
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Song } from "src/songs/schemas/song";
import { User } from "src/users/schemas/user";

export type AlbumDocument = HydratedDocument<Album>

@Schema()
export class Album {
    @Prop({
        type: String,
        required: true,
    })
    title: string;

    @Prop({
        type: Types.ObjectId,
        ref:"User",
        required: true
    })
    artist: User;

    @Prop({
        type: Number,
        required: true
    })
    releasedYear: number

    @Prop({
        // array of MongoDB ObjectIDs.
        type: [Types.ObjectId],
        ref: "Song"
    })
    songs: Types.ObjectId[];

    @Prop({
        type: Boolean,
        required: true,
    })
    isDefault: boolean;
}

export const AlbumSchema = SchemaFactory.createForClass(Album).index({title: 1, artist: 1}, {unique: true}); 
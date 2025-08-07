import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "src/users/schemas/user";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({timestamps: true})
export class Comment {
    @Prop({
        type: Types.ObjectId,
        ref:"User",
        required: true
    })
    sender: User;

    @Prop({
        type: Types.ObjectId,
        ref:"Song",
        required: true
    })
    songId: Types.ObjectId;

    @Prop({
        type: String,
        required: true
    })
    message: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
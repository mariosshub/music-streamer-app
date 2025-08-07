import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({
        type: String,
        required: true,
        unique: true
    })
    email: string;

    @Prop({
        type: String,
        required: true,
        unique: true
    })
    username: string;

    @Prop({
        type: String,
        required: true
    })
    password: string;

    @Prop({
        type: String
    })
    refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
import { UserModel } from "./User";

export type CommentsModel = {
    _id: string,
    sender: UserModel,
    songId: string,
    message: string,
    createdAt: Date,
    updatedAt: Date
}

export type CreateCommentsModel = {
    songId: string,
    message: string
}
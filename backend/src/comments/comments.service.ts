import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument } from "./schemas/comment";
import { Connection, Model, Types, UpdateWriteOpResult } from "mongoose";
import { CreateCommentDTO } from "./dto/create-comment.dto";
import { SongsService } from "src/songs/songs.service";
import { User } from "src/users/schemas/user";
import { SocketService } from "src/socket/socket.service";

@Injectable()
export class CommentsService {

    constructor(
        @InjectModel(Comment.name)
        private readonly commentModel: Model<CommentDocument>,
        @InjectConnection()
        private readonly connection: Connection,
        private songsService: SongsService,
        private socketService: SocketService
    )
    {}

    // creates comment and emits back with websocket
    async createComment(createCommentDto: CreateCommentDTO, userId: string): Promise<UpdateWriteOpResult>{
        const session = await this.connection.startSession();
        try {
            session.startTransaction();
            // added the object in [] in create because of the parameter options
            let comment = await this.commentModel.create([{
                sender: new Types.ObjectId(userId),
                songId: new Types.ObjectId(createCommentDto.songId),
                message: createCommentDto.message
            }], {session});

            // update the songs comments by pushing the created comment
            let songCommentUpdateAction = await this.songsService.updateSongComments(createCommentDto.songId, comment[0]._id, session);

            await session.commitTransaction();

            let commentPopulated = await comment[0].populate<{sender: User}>('sender');
            // return comment with websocket
            this.socketService.socket.emit('receive_comment', commentPopulated)
            return songCommentUpdateAction
        } catch (error) {
            await session.abortTransaction();
            throw error
        } finally {
            session.endSession()
        }
    }
}
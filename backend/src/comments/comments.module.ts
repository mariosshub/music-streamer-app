import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "./schemas/comment";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { SongsModule } from "src/songs/songs.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
        SongsModule],
    controllers: [CommentsController],
    providers: [CommentsService],
    exports: [CommentsService]
})
export class CommentsModule {}
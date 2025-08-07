import { Body, Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CreateCommentDTO } from "./dto/create-comment.dto";
import { CommentsService } from "./comments.service";

@Controller("comments")
export class CommentsController {

    constructor(
        private commentsService: CommentsService
    )
    {}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    createComment(@Body() createCommentDto: CreateCommentDTO, @Request() req) {
        return this.commentsService.createComment(createCommentDto, req.user.userId)
    }
    
}
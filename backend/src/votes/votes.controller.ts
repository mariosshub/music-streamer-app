import { Body, Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { VotesService } from "./votes.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CreateVoteDTO } from "./dto/create-vote.dto";

@Controller("votes")
export class VotesController {

    constructor(private votesService: VotesService)
    {}

    @Post('addVote')
    @UseGuards(JwtAuthGuard)
    addVote(@Body() createVotedto: CreateVoteDTO, @Request() req) {
        return this.votesService.addVote(createVotedto, req.user.userId)
    }

    @Post('removeVote')
    @UseGuards(JwtAuthGuard)
    removeVote(@Body() createVotedto: CreateVoteDTO, @Request() req) {
        return this.votesService.removeVote(createVotedto, req.user.userId)
    }

    @Get('hasVoted/:songId')
    @UseGuards(JwtAuthGuard)
    checkUserHasVoted(@Param('songId') songId: string, @Request() req) {
        return this.votesService.userHasVoted(songId, req.user.userId);
    }
}
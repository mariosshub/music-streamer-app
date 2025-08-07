import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Vote, VoteDocument } from "./schemas/vote";
import { Model, Types } from "mongoose";
import { CreateVoteDTO } from "./dto/create-vote.dto";
import { SongsService } from "src/songs/songs.service";

@Injectable()
export class VotesService {
    constructor(
        @InjectModel(Vote.name)
        private readonly voteModel: Model<VoteDocument>,
        private songsService: SongsService
    ){}

    async addVote(createVotedto: CreateVoteDTO, userId: string): Promise<void> {
        const songIdToVote = createVotedto.songId;
        const hasVoted = await this.userHasVoted(songIdToVote, userId);
        // check if userHasVoted
        if(hasVoted)
            throw new HttpException("User has already voted", HttpStatus.INTERNAL_SERVER_ERROR)

        this.voteModel.create({
            songId: new Types.ObjectId(songIdToVote),
            voterId: new Types.ObjectId(userId)
        }).then(() => {
            // increase the vote count
            this.songsService.increaseSongVotes(songIdToVote);
        });
    }

    async removeVote(createVotedto: CreateVoteDTO, userId: string): Promise<void> {
        const songIdToRemoveVote = createVotedto.songId;

        return this.voteModel.deleteOne({songId: new Types.ObjectId(songIdToRemoveVote), voterId: new Types.ObjectId(userId)})
        .orFail(new HttpException("Vote not found", HttpStatus.NOT_FOUND))
        .then(() => {
            // decrease the vote count
            this.songsService.decreaseSongVotes(songIdToRemoveVote);
        })
    }

    async userHasVoted(songId:string, userId: string): Promise<boolean> {
        let vote = await this.voteModel.find({songId: new Types.ObjectId(songId), voterId: new Types.ObjectId(userId)});
        if(vote.length > 0)
            return true;
        return false;
    }

}
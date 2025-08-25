import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Vote, VoteDocument } from "./schemas/vote";
import { Connection, DeleteResult, Model, Types } from "mongoose";
import { CreateVoteDTO } from "./dto/create-vote.dto";
import { SongsService } from "src/songs/songs.service";

@Injectable()
export class VotesService {
    constructor(
        @InjectModel(Vote.name)
        private readonly voteModel: Model<VoteDocument>,
        @InjectConnection()
        private readonly connection: Connection,
        private songsService: SongsService
    ){}

    async addVote(createVotedto: CreateVoteDTO, userId: string): Promise<void> {
        const songIdToVote = createVotedto.songId;
        const hasVoted = await this.userHasVoted(songIdToVote, userId);
        // check if userHasVoted
        if(hasVoted)
            throw new HttpException("User has already voted", HttpStatus.INTERNAL_SERVER_ERROR)

        const session = await this.connection.startSession();
        try {
            session.startTransaction();
            await this.voteModel.create([{
                songId: new Types.ObjectId(songIdToVote),
                voterId: new Types.ObjectId(userId)
            }], {session})

            // increase the vote count
            await this.songsService.increaseSongVotes(songIdToVote, session)
            await session.commitTransaction()
        } catch (error) {
            await session.abortTransaction();
            throw error
        } finally {
            session.endSession()
        }
    }

    async removeVote(createVotedto: CreateVoteDTO, userId: string): Promise<void> {
        const songIdToRemoveVote = createVotedto.songId;

        const session = await this.connection.startSession();
        try {
            session.startTransaction();
            await this.voteModel.deleteOne({
                songId: new Types.ObjectId(songIdToRemoveVote), 
                voterId: new Types.ObjectId(userId)
            }).orFail(new HttpException("Vote not found", HttpStatus.NOT_FOUND));

            await this.songsService.decreaseSongVotes(songIdToRemoveVote, session);
            session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error
        } finally {
            session.endSession()
        }
    }

    async userHasVoted(songId:string, userId: string): Promise<boolean> {
        let vote = await this.voteModel.find({songId: new Types.ObjectId(songId), voterId: new Types.ObjectId(userId)});
        if(vote.length > 0)
            return true;
        return false;
    }

}
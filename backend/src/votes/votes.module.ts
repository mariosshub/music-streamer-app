import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Vote, VotesSchema } from "./schemas/vote";
import { VotesController } from "./votes.controller";
import { VotesService } from "./votes.service";
import { SongsModule } from "src/songs/songs.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Vote.name, schema: VotesSchema}]),
        SongsModule
    ],
    controllers: [VotesController],
    providers: [VotesService],
    exports: [VotesService]
})
export class VotesModule {}
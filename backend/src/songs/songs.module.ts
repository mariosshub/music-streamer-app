import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Song, SongSchema } from "./schemas/song";
import { SongsService } from "./songs.service";
import { SongsController } from "./songs.controller";
import { UsersModule } from "src/users/users.module";
import { AlbumsModule } from "../albums/albums.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Song.name, schema: SongSchema}]),
        UsersModule,
        forwardRef(() => AlbumsModule)
    ],
    controllers:[SongsController],
    providers: [SongsService],
    exports: [SongsService]
})
export class SongsModule {}
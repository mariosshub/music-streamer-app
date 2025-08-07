import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Album, AlbumSchema } from "./schemas/album";
import { AlbumsController } from "./albums.controller";
import { AlbumsService } from "./albums.service";
import { SongsModule } from "../songs/songs.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Album.name, schema: AlbumSchema}]),
        forwardRef(() =>SongsModule) 
    ],
    controllers: [AlbumsController],
    providers: [AlbumsService],
    exports: [AlbumsService]
})
export class AlbumsModule {}
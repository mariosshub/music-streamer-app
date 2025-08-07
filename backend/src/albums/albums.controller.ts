import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { AlbumsService } from "./albums.service";
import { CreateAlbumDTO } from "./dto/create-album.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { UpdateAlbumSongsDTO } from "./dto/update-album-songs.dto";
import { RenameAlbumDTO } from "./dto/rename-album.dto";

@Controller("albums")
export class AlbumsController {

    constructor(
        private albumsService: AlbumsService
    ){}


    @Get('all')
    @UseGuards(JwtAuthGuard)
    getAlbumsOfLoggedInUser(@Request() req) {
        return this.albumsService.getAllAlbumsOfUser(req.user.userId);
    }

    @Get('search')
    @UseGuards(JwtAuthGuard)
    searchAlbum(
        @Query('limit') limit:string | undefined, 
        @Query('skip') skip:string | undefined, 
        @Query('album') album:string | undefined, 
        @Query('artist') artist:string | undefined, ) {
            const albumTitle = album ? album : "";
            const artistName = artist ? artist : "";
            const lim = limit ? parseInt(limit) : 100;
            const sk = skip ? parseInt(skip) : 0;
            return this.albumsService.searchAlbum(lim, sk, albumTitle, artistName);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    getAlbumWithSongs(@Param() id: string) {
        return this.albumsService.getAlbumPopulateSongs(id);
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    createAlbum(@Body() createAlbumDto: CreateAlbumDTO, @Request() req) {
        return this.albumsService.createAlbum(createAlbumDto, req.user.userId);
    }

    @Put('rename')
    @UseGuards(JwtAuthGuard)
    renameAlbum(@Body() renameAlbumDto: RenameAlbumDTO, @Request() req) {
        return this.albumsService.renameAlbum(renameAlbumDto, req.user.userId)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    deleteAlbum(@Param() id: string, @Request() req) {
        return this.albumsService.deleteAlbum(id, req.user.userId);
    }
    
}
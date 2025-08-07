import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, Req, Request, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { SongsService } from "./songs.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "./multer/multer.options";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { MulterMusicFile } from "./multer/multer-file.types";
import { UpdateSongDTO } from "./dto/update-song.dto";

@Controller("songs")
export class SongsController {
    constructor(private songsService:SongsService){}

    @Get('all')
    findAll() {
        return this.songsService.findAll();
    }

    @Get('top5')
    @UseGuards(JwtAuthGuard)
    findTop5Songs(){
        return this.songsService.getTop5SongsAmongUsers();
    }

    @Get('topSongsGenre/:value')
    @UseGuards(JwtAuthGuard)
    findTopSongsByGenre(@Param('value') value: string){
        return this.songsService.getTopSongsByGenre( value);
    }

    @Get('genre/:value')
    @UseGuards(JwtAuthGuard)
    findSongsByGenre(@Param('value') value: string, 
        @Query('limit') limit:number | undefined, 
        @Query('skip') skip:number | undefined ){
        return this.songsService.getSongsByGenre(value, limit, skip);
    }

    @Get("recent")
    @UseGuards(JwtAuthGuard)
    findRecentlyReleasedSongs() {
        let songs =  this.songsService.getRecentlyReleasedSongs();
        return songs
    }
    
    @Get("groupedByGenre")
    @UseGuards(JwtAuthGuard)
    getsongsGroupedByGenre(@Request() req) {
        return this.songsService.groupSongsByGenre(req.user.userId)
    }

    @Get('user/:id')
    findSongsOfUser(@Param() id: string) {
        return this.songsService.findSongsByUsersId(id);
    }

    @Get(':id')
    findSongByIdPopulateComments(@Param() id: string){
        return this.songsService.findSongByIdPopulateComments(id);
    }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async uploadSong(@UploadedFile() file: MulterMusicFile, @Request() req, @Body() body) {
        return this.songsService.uploadSong(file, body, req.user.userId)  
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    updateSong(@Param() id: string, @Body() updateSongDto: UpdateSongDTO, @Request() req) {
        return this.songsService.updateSong(id, updateSongDto, req.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    deleteSong(@Param() id: string, @Request() req) {
        return this.songsService.deleteSong(id, req.user.userId);
    }

    @Get('stream/:id')
    async streamSong(@Param() id: string,@Res() res) {
        const filestream = await this.songsService.readSongStream(id);
        const fileInfo = await this.songsService.findSongInfo(id);

        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': fileInfo.length
        });
        return filestream.pipe(res);
    }

}
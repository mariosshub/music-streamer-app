import { musicGenres, musicGenresModel } from "./music-genres.data"

export const mapMusicGenres = (id: string | undefined): musicGenresModel | null => {
    let genreFound = null;
    if(!id)
        return null
    musicGenres.map(genre => { 
        if(genre.id == id) 
            genreFound = genre;
    })
    
    return genreFound
}
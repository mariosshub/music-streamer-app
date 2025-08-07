import { axiosInstance } from "@/lib/axios"
import { AlbumSearchResponse } from "@/models/Album"
import { SongModel } from "@/models/Song"
import { musicGenres, musicGenresModel } from "@/utils/music-genres.data"
import { create } from "./storeCreator";

type SearchStore =  {
    songGenres: musicGenresModel[]
    selectedGenre: musicGenresModel | null,
    songsByGenre: SongModel[],
    allAlbums: AlbumSearchResponse[],

    pageSong: number,
    pageAlbum: number,
    hasMoreSongs: boolean,
    hasMoreAlbums: boolean
    isLoading: boolean,
    isLoadingSongs: boolean,
    isLoadingAlbums: boolean,
    errorMessage: string | null,

    selectedTab: string,
    albumFilter: string,
    artistFilter: string,

    fetchSongGenres: () => Promise<void>,
    fetchSongsByGenre: (genre: string) => Promise<void>,
    setSelectedGenre: (genre: string | null) => void,
    clearSongs: () => void,
    searchAlbums: (title:string, username:string) => Promise<void>,
    clearAlbums: () => void,
    setSelectedTab: (tabValue: string) => void,
    setAlbumFilter: (albumFilter: string) => void,
    setArtistFilter: (artistFilter: string) => void,
}

export const useSearchStore = create<SearchStore>()((set,get) => ({
  songGenres: [],
  selectedGenre: null,
  songsByGenre: [],
  allAlbums: [],

  pageSong: 0,
  pageAlbum: 0,
  hasMoreSongs:true,
  hasMoreAlbums: true,
  isLoading: false,
  isLoadingSongs: false,
  isLoadingAlbums: false,

  errorMessage: null,
  selectedTab: "songs",
  albumFilter: "",
  artistFilter: "",

  fetchSongGenres: async() => {
    set({isLoading: true, errorMessage: null});
    try {
      const response = await axiosInstance.get("/songs/groupedByGenre")
      if(response){
        let genres:{_id:string}[] = response.data;
        let genresWithColor: musicGenresModel[] = [];
        genres.forEach((element) => {
          musicGenres.map(genre => {
            if(genre.id === element._id)
              genresWithColor.push(genre)
          })
        });
        set({songGenres: genresWithColor});
      }
    } catch(error: any) {
      set({errorMessage: error.response.data.message,
        songGenres: []
      });
    } finally {
      set({isLoading: false});
    }
  },

  fetchSongsByGenre: async(genre: string) => {
    set({isLoadingSongs: true, errorMessage: null});
    try {
      const response = await axiosInstance.get(`/songs/genre/${genre}?limit=5&skip=${5 * get().pageSong}`);
      if(response){
        set(state => ({
          songsByGenre: [...state.songsByGenre, ...response.data],
          pageSong: state.pageSong + 1
        }))

        if(response.data.length < 5){
          set({hasMoreSongs: false})
        }
      }
    } catch(error: any) {
      set({errorMessage: error.response.data.message,
        songsByGenre: []
      });
    } finally {
      set({isLoadingSongs: false});
    }
  },

  setSelectedGenre: (genre: string | null) => {
    if(genre){
      musicGenres.map(musicGenre => {
        if(musicGenre.id === genre)
          set({selectedGenre: musicGenre})
      })
    }
    else
      set({selectedGenre: null})
  },

  clearSongs: () =>{
    set({
      songsByGenre: [],
      pageSong: 0,
      hasMoreSongs: true
    })
  },

  searchAlbums: async(title: string, username:string) => {
    set({isLoadingAlbums: true, errorMessage: null});
    try {
      const response = await axiosInstance.get('/albums/search/', 
        {params:
          { album: title, 
            artist: username, 
            limit:5, 
            skip: 5 * get().pageAlbum
          }
        }
      );
      if(response){
        set(state => ({
          allAlbums: [...state.allAlbums, ...response.data],
          pageAlbum: state.pageAlbum + 1
        }))

        if(response.data.length <5){
          set({hasMoreAlbums: false})
        }
      }
    } catch(error: any) {
      set({errorMessage: error.response.data.message,
        allAlbums: []
      });
    } finally {
      set({isLoadingAlbums: false});
    }
  },

  clearAlbums: () =>{
    set({
      allAlbums: [],
      pageAlbum: 0,
      hasMoreAlbums: true
    })
  },

  setSelectedTab: (tabValue: string) => {
    set({selectedTab:tabValue})
  },

  setAlbumFilter: (albumFilter: string) => {
    set({albumFilter})
  },

  setArtistFilter: (artistFilter: string) => {
    set({artistFilter})
  }
}))
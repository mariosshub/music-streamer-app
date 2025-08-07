import useCustomizedToast from '@/hooks/useCustomizedToast';
import { axiosInstance } from '@/lib/axios';
import { AlbumPopulatedSongs, AlbumResponse, RenameAlbum} from '@/models/Album';
import { SongModel } from '@/models/Song';
import { create } from "./storeCreator";

type MusicStore = {
  albumSongs: SongModel[],
  albums: AlbumResponse[],
  isLoading: boolean,
  errorMessage: string | null,
  currentAlbum: AlbumPopulatedSongs | null,
  top5Songs: SongModel[],
  topSongsByGenre: SongModel[],
  recentlyReleasedSongs: SongModel[],
  fetchUsersAlbums: () => Promise<void>,
  fetchAlbumByIdPopulatedSongs: (albumId: string) => Promise<void>,
  fetchTop5Songs: () => Promise<void>,
  fetchTopSongsByGenre: (genre: string) => Promise<void>,
  fetchRecentlyReleasedSongs: () => Promise<void>,
  setRecentlyReleasedSongs: (recentSong: SongModel) => void
  deleteSong: (songId: string) => Promise<void>,
  deleteAlbum: (albumId: string) => Promise<void>,
  renameAlbum: (albumId: string, title: string) => Promise<void>,
}

export const useMusicStore = create<MusicStore>()((set, get) => ({
  albumSongs: [],
  albums: [],
  isLoading: false,
  errorMessage: null,
  currentAlbum: null,
  top5Songs: [],
  topSongsByGenre: [],
  recentlyReleasedSongs: [],

  fetchUsersAlbums: async() => {
    set({isLoading: true, errorMessage: null});
    try {
      const response = await axiosInstance.get("/albums/all")
      if(response){
        set({albums: response.data});
      }
    } catch(error: any) {
      set({errorMessage: error.response.data.message,
        albums: []
      });
    } finally {
      set({isLoading: false});
    }
  },

  fetchAlbumByIdPopulatedSongs: async(albumId: string) => {
    set({isLoading: true, errorMessage: null});
    try {
      const response = await axiosInstance.get<AlbumPopulatedSongs>(`/albums/${albumId}`)
      if(response){
        set({
          currentAlbum: response.data,
          albumSongs: response.data.songs
        });
      }
    } catch(error: any) {
      set({errorMessage: error.response.data.message,
        currentAlbum: null,
        albumSongs: []
      });
    } finally {
      set({isLoading: false});
    }
  },

  fetchTop5Songs: async () => {
    set({isLoading: true, errorMessage: null});
    try {
      const response = await axiosInstance.get('/songs/top5')
      if(response){
        set({top5Songs: response.data});
      }
    } catch(error: any) {
      set({errorMessage: error.response.data.message,
        top5Songs: []
      });
    } finally {
      set({isLoading: false});
    }
  },

  fetchTopSongsByGenre: async (genre: string) => {
    set({isLoading: true, errorMessage: null});
    try {
      const response = await axiosInstance.get(`/songs/topSongsGenre/${genre}`)
      if(response){
        set({topSongsByGenre: response.data});
      }
    } catch(error: any) {
      set({errorMessage: error.response.data.message,
        topSongsByGenre: []
      });
    } finally {
      set({isLoading: false});
    }
  },

  fetchRecentlyReleasedSongs: async () => {
    set({isLoading: true, errorMessage: null});
    try {
      const response = await axiosInstance.get('/songs/recent')
      if(response){
        set({recentlyReleasedSongs: response.data});
      }
    } catch(error: any) {
      set({errorMessage: error.response.data.message, 
        recentlyReleasedSongs: []
      });
    } finally {
      set({isLoading: false});
    }
  },


  setRecentlyReleasedSongs: (recentSong: SongModel) => {
    set(state => ({
      recentlyReleasedSongs: [recentSong, ...state.recentlyReleasedSongs].length > 8 ?
       [recentSong, ...state.recentlyReleasedSongs].slice(0, -1) : [recentSong, ...state.recentlyReleasedSongs]
    }));
  },

  deleteSong: async (songId: string) => {
    const {toastSuccess, toastErrorApi} = useCustomizedToast();
    set({isLoading: true, errorMessage: null});
    try{
      await axiosInstance.delete(`/songs/${songId}`);
      set(state => ({
        albumSongs: state.albumSongs.filter(song => song._id !== songId)
      }))
      toastSuccess("Song deleted!")
    } catch (error: any) {
      toastErrorApi(error)
    } finally {
      set({isLoading: false});
    }
  },

  deleteAlbum: async (albumId: string) => {
    const {toastSuccess, toastErrorApi} = useCustomizedToast();
    set({ isLoading: true, errorMessage: null });
    try{
      await axiosInstance.delete(`/albums/${albumId}`);
      set(state => ({
        albums: state.albums.filter((album) => album._id !== albumId),
        currentAlbum: null,
        albumSongs: []
      }))
      toastSuccess("Album deleted!")
    } catch (error: any) {
      toastErrorApi(error)
    } finally {
      set({isLoading: false});
    }
  },

  renameAlbum: async (albumId:string, title:string) => {
    const {toastSuccess, toastErrorApi} = useCustomizedToast();
    set({ isLoading: true, errorMessage: null });

    let renameAlbum:RenameAlbum = {
      id: albumId,
      title
    }
    try{
      await axiosInstance.put('/albums/rename', renameAlbum);


      const albumsUpdated = get().albums.map(album => 
        album._id === albumId ? {...album, title} : album //create a new array and pass the changed album
      )

      set(state => ({
        albums: albumsUpdated,
        currentAlbum: state.currentAlbum ? {...state.currentAlbum, title} : state.currentAlbum
      }))
      toastSuccess("Album renamed!")
    } catch (error: any) {
      toastErrorApi(error)
    } finally {
      set({isLoading: false});
    }
  }

}))
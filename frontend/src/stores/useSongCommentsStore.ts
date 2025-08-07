import { axiosInstance } from "@/lib/axios";
import { CommentsModel } from "@/models/Comments";
import { SongWithCommentsModel } from "@/models/Song";
import { create } from "./storeCreator";

type SongCommentsStore = {
  songWithComments: SongWithCommentsModel | null,
  commentsLimitedTo4: CommentsModel[],
  isLoading: boolean,
  errorMessage: string | null,

  fetchSongWithComments: (songId: string) => Promise<void>,
  setReceivedComments: (comment: CommentsModel) => void,
  increaseSongVotes: () => void,
  decreaseSongVotes: () => void
}

export const useSongCommentsStore = create<SongCommentsStore>()(set => ({
  songWithComments: null,
  commentsLimitedTo4: [],
  isLoading: false,
  errorMessage: null,

  fetchSongWithComments: async(songId: string) => {
    set({isLoading: true, errorMessage: null});
    try {
      const response = await axiosInstance.get<SongWithCommentsModel>(`/songs/${songId}`)
      if(response){
        set({
          songWithComments: response.data,
          commentsLimitedTo4: response.data.comments.slice(-4)
        });
      }
    } catch(error: any) {
      set({errorMessage: error.response.data.message,
        songWithComments: null,
        commentsLimitedTo4: []
      });
    } finally {
      set({isLoading: false});
    }
  },

  setReceivedComments: (comment: CommentsModel) => {
    set(state => ({
      songWithComments: state.songWithComments ? 
      {...state.songWithComments, comments:[...state.songWithComments.comments, comment]} : state.songWithComments,
      commentsLimitedTo4: [...state.commentsLimitedTo4, comment].slice(-4)
    }))
    
  },

  increaseSongVotes: () => {
    set(state =>({
      songWithComments: state.songWithComments ? {...state.songWithComments, votes: state.songWithComments.votes + 1} : state.songWithComments
    }))
  },

  decreaseSongVotes: () => {
    set(state =>({
      songWithComments: state.songWithComments ? {...state.songWithComments, votes: state.songWithComments.votes - 1} : state.songWithComments
    }))
  }
}))
import useCustomizedToast from '@/hooks/useCustomizedToast';
import { axiosInstance } from '@/lib/axios';
import { create } from "./storeCreator";

type VotesStore = {
  userHasVoted: boolean,
  isVotesLoading: boolean,
  updatingVotes: boolean,
  errorMessageVotes: string | null,

  addVote: (songId: string) => Promise<void>,
  removeVote: (songId: string) => Promise<void>,
  fetchHasVoted: (songId: string) => Promise<void>
}

export const useVotesStore = create<VotesStore>()((set) => ({
  userHasVoted: false,
  isVotesLoading: false,
  updatingVotes: false,
  errorMessageVotes: null,

  addVote: async(songId: string) => {
    const {toastErrorApi} = useCustomizedToast();
    set({updatingVotes: true});
    try {
      const response = await axiosInstance.post('/votes/addVote',{songId})
      if(response){
        set({
          userHasVoted: true
        });
      }
    } catch(error: any) {
      toastErrorApi(error)
    } finally {
      set({updatingVotes: false});
    }
  },

  removeVote: async(songId: string) => {
    set({updatingVotes: true});
    const {toastErrorApi} = useCustomizedToast();
    try {
      const response = await axiosInstance.post('/votes/removeVote',{songId})
      if(response){
        set({
          userHasVoted: false
        });
      }
    } catch(error: any) {
      toastErrorApi(error)
    } finally {
      set({updatingVotes: false});
    }
  },

  fetchHasVoted: async(songId: string) => {
    set({isVotesLoading: true, errorMessageVotes: null});
    try {
      const response = await axiosInstance.get<boolean>(`/votes/hasVoted/${songId}`)
      if(response){
        set({
          userHasVoted: response.data
        });
      }
    } catch(error: any) {
      set({errorMessageVotes: error.response.data.message});
    } finally {
      set({isVotesLoading: false});
    }
  }
}))
import { SongModel } from "@/models/Song";
import { create } from "./storeCreator";

type AudioPlayerStore = {
	currentSong: SongModel | null,
  currentSection: string, // for handling play/pause buttons when same songs are displayed in home page sections
	isPlaying: boolean,
	queue: SongModel[],
	currentIndex: number,

	initializeQueue: (songs: SongModel[]) => void,
	playAlbum: (songs: SongModel[], startIndex?: number) => void,
	setCurrentSong: (song: SongModel | null) => void,
	togglePlay: () => void,
	playNext: () => void,
	playPrevious: () => void,
  setCurrentSection: (section: string) => void,
  clearPlayer: () => void
}

export const useAudioPlayerStore = create<AudioPlayerStore>()((set, get) => ({
  currentSong: null,
  currentSection: "",
	isPlaying: false,
	queue: [],
	currentIndex: -1,

  initializeQueue: (songs: SongModel[]) => {
		set({
			queue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
	},

  playAlbum: (songs: SongModel[], startIndex=0) => {
    if (songs.length === 0) return;

		const song = songs[startIndex];

    set({
			queue: songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
		});
  },

  setCurrentSong: (song: SongModel | null) => {
    if (!song) return;

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
		});
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;
    set({
			isPlaying: willStartPlaying,
		});
  },

  playNext: () => {
    const { currentIndex, queue } = get();
		const nextIndex = currentIndex + 1;

    // play next song if exists in queue
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      set({
				currentSong: nextSong,
				currentIndex: nextIndex,
				isPlaying: true,
			});
    }else {
      set({ isPlaying: false });
    }
  },
  
  playPrevious: () => {
    const { currentIndex, queue } = get();
		const prevIndex = currentIndex - 1;

    // check if a prev song exists
		if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
			set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
			});
    } else {
      set({ isPlaying: false });
    }
  },

  setCurrentSection: (section: string) => {
    set({currentSection:section});
  },

  clearPlayer: () => {
    set({
      currentSong: null,
      currentSection: "",
	    isPlaying: false,
	    queue: [],
	    currentIndex: -1,
    })
  }
}));
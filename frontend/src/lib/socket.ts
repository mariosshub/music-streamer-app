import { CommentsModel } from "@/models/Comments";
import { SongModel } from "@/models/Song";
import { io } from "socket.io-client";

const baseUrl = import.meta.env.VITE_API_URL //the backend url based on dev or prod mode

const socketInstance = io(baseUrl, {
	autoConnect: false, //only connect if user is authenticated
});

const initSocket = (token: string, 
  setReceivedComments: (comment: CommentsModel) => void,
  setRecentlyReleasedSongs: (recentSong: SongModel) => void
) => {
  if(!socketInstance.connected){
    //pass auth token
    socketInstance.auth = {token: token}
    socketInstance.connect();

    socketInstance.on('receive_comment', setReceivedComments)

    socketInstance.on('recently_uploaded', setRecentlyReleasedSongs)

    socketInstance.on('exception', (exception: any) => {
      console.log('socket exception', exception)
    })

    socketInstance.on('connect', () => console.log('socket listening...'))
    socketInstance.on('disconnect', () => {
      socketInstance.off('receive_comment')
      socketInstance.off('exception')
      socketInstance.off('connect')
      socketInstance.off('disconnect')
    })
  }
}

const disconnectSocket = () => {
  if (socketInstance.connected) {
    socketInstance.disconnect();
    socketInstance.off('receive_comment')
    socketInstance.off('exception')
    socketInstance.off('connect')
    socketInstance.off('disconnect')
  }
}

export {socketInstance, initSocket, disconnectSocket}
import { CreateSongModel } from "@/models/Song";

let audio = document.createElement('audio');
export const setAudioDuration = (file:File, newSong:CreateSongModel, setNewSong:React.Dispatch<React.SetStateAction<CreateSongModel>>) => {
  let reader = new FileReader();
  reader.onload = (e) => {
    if(e.target?.result){
      audio.src = e.target?.result?.toString();
      audio.addEventListener('loadedmetadata', function(){
        // save the duration in seconds
        setNewSong({...newSong, durationInSec:Math.round(audio.duration).toString()})
      })
    }
  }
  reader.readAsDataURL(file);
}
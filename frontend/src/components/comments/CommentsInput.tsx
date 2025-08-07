import { Input } from '../ui/input'
import { CreateCommentsModel } from '@/models/Comments';
import useCustomizedToast from '@/hooks/useCustomizedToast';
import { axiosInstance } from '@/lib/axios';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { useSongCommentsStore } from '@/stores/useSongCommentsStore';
import { useState } from 'react';

const CommentsInput = () => {
  const {songWithComments} =  useSongCommentsStore();
  const [newMessage, setNewMessage] = useState("");
  const {toastSuccess, toastError, toastErrorApi} = useCustomizedToast();

  const createComment = async(newComment: CreateCommentsModel) => {
    try {
      // response will be returned with websocket
      await axiosInstance.post('/comments/create', newComment)
    } catch(error: any) {
      toastErrorApi(error);
    }
  }

  const handleSend = async() => {
    if(newMessage.trim().length < 5 || newMessage.trim().length > 200){
      toastError("Please provide a comment from 5-200 characters");
      return;
    }

    if(!songWithComments?._id){
      toastError("There was an error uploading comment");
      return;
    }

    let newComment: CreateCommentsModel = {
      songId: songWithComments._id,
      message: newMessage
    } 

    await createComment(newComment);
    toastSuccess("Comment uploaded!")
    setNewMessage("");
  }


  return (
    <div className='flex items-center gap-2 p-2'>
      <Input
        placeholder='Type a comment'
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className='bg-zinc-800 rounded-xl border-none'
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <Button className="rounded-xl bg-zinc-100 cursor-pointer flex justify-center items-center" 
        size={"icon"} 
        onClick={handleSend} 
        disabled={!newMessage.trim()}
      >
        <Send className='size-4.5' />
      </Button>
    </div>
  )
}

export default CommentsInput
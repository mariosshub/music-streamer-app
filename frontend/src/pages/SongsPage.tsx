import { useSongCommentsStore } from "@/stores/useSongCommentsStore";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router"
import LoadingPage from "./LoadingPage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/providers/AuthProvider";
import EditSongDialog from "@/components/dialogs/EditSongDialog";
import { ArrowLeft, MessageCircleMore, Star, UserCircle2 } from "lucide-react";
import DeleteConfirmationDialog from "@/components/dialogs/DeleteConfirmationDialog";
import EmptyBox from "@/components/loadingViews/EmptyBox";
import CommentsInput from "@/components/comments/CommentsInput";
import ErrorPage from "./ErrorPage";
import { mapMusicGenres } from "@/utils/mapMusicGenres";
import { Button } from "@/components/ui/button";
import { useVotesStore } from "@/stores/useVotesStore";
import { formatTime } from "@/utils/formatTime";

const SongsPage = () => {
  const {songId} = useParams();
  const {fetchSongWithComments, editSongDetails, songWithComments, commentsLimitedTo4, isLoading, errorMessage, 
    increaseSongVotes, decreaseSongVotes} = useSongCommentsStore();
  const {userHasVoted, isVotesLoading, updatingVotes, errorMessageVotes, addVote, removeVote, fetchHasVoted} = useVotesStore();
  const {loggedInUser} = useAuth();
  const navigate = useNavigate();

 // dont fetch again the song details if this song was recently viewed
  useEffect(() => {
    if(songId){
      if(!songWithComments || songWithComments._id !== songId){
        fetchSongWithComments(songId)
      }
    } 
  }, [songId])

  // fetch the "hasVoted" only when user is not the owner of song
  useEffect(() => {
    if(songWithComments && songWithComments._id !== songId && !isSongOwner() && songId != null){
      fetchHasVoted(songId)
    }
  },[songWithComments])

  // check if is owner of song
  const isSongOwner = () => {
    if(songWithComments){
      return songWithComments.artist._id == loggedInUser?._id;
    }
    return false;
  }

  const userIsAuthor = (userId: string) => {
    return userId == loggedInUser?._id;
  }

  const showMoreComments = () => {
    if(songWithComments){
      if(songWithComments.comments.length > 0){
        return `Show more ${'(' + songWithComments.comments.length + ')'}`
      }
      else {
        return ''
      }
    }
    return ''
  }

  const showLikes = () => {
    if(songWithComments){
      if(songWithComments?.votes == 0 || songWithComments?.votes > 1)
        return `${songWithComments.votes} Likes`
      else
        return `${songWithComments.votes} Like`
    }
    
  }

  const onLikeBtnClick = (songId: string) => {
    if(userHasVoted)
      removeVote(songId).then(()=> {
        decreaseSongVotes();
      })
    else
      addVote(songId).then(() => {
        increaseSongVotes();
      })
  }

  const errorPage = () => {
    if(errorMessage)
      return  <ErrorPage title={errorMessage} 
      description="Looks like this song got lost in shuffle. Let's get you back to the music."
      status=""/>
    else if(errorMessageVotes)
      return <ErrorPage title={errorMessageVotes} 
      description="Looks like this song got lost in shuffle. Let's get you back to the music."
      status=""/>
  }

  if(isLoading || isVotesLoading){
    return <LoadingPage />
  }

  return (
    <ScrollArea className='h-full'>
      {errorPage()}
        {/* Details of song */}
        <div className='flex rounded-lg px-4 py-2 gap-4 bg-gradient-to-b from-[#005f5a]/80 via-zinc-900/80
        to-zinc-900'>
          <div className='flex flex-col w-full justify-end'>
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 cursor-pointer hover:text-blue-600" onClick={() => {navigate(-1)}}/>
              <p className='text-sm font-medium'>Song</p>
              <span className="flex items-center gap-1 ml-auto font-medium">
                <Star className='w-4 h-4 fill-amber-500'/> 
                <p>{showLikes()}</p>
              </span>
            </div>
            <h1 className='text-5xl sm:text-7xl font-bold mt-2'>{songWithComments?.title}</h1>
            <div className='flex flex-wrap justify-between pt-4 gap-2'>
              <ul className="font-medium text-zinc-100">
                <li>Created by: {isSongOwner() ? 'you' : songWithComments?.artist.username}</li>
                <li>Genre: {mapMusicGenres(songWithComments?.genre)?.value}</li>
                <li>Released on:  {songWithComments?.releasedDate ? new Date(songWithComments.releasedDate).toLocaleDateString() : ''}</li>
                <li>Duration:  {formatTime(songWithComments ? songWithComments.durationInSec : 0)}</li>
              </ul>
              <div className="self-end flex gap-4 text-s">
                {isSongOwner() && songWithComments &&
                  <EditSongDialog song={songWithComments} updateSongDetails={editSongDetails}>
                        <span className="cursor-pointer text-blue-600 hover:underline">Edit song</span>
                  </EditSongDialog>
                }
                {isSongOwner() && songWithComments?._id &&
                  <DeleteConfirmationDialog
                    id={songWithComments._id}
                    desc={<span>The song will be deleted permanetly</span>}
                    action="delete_song"
                  >
                    <span className="cursor-pointer text-red-600 hover:underline">Delete song</span>
                  </DeleteConfirmationDialog>
                }
                {!isSongOwner() && songWithComments?._id &&
                  <Button
                    size='sm'
                    className='rounded-xl group cursor-pointer hover:scale-105 transition-all'
                    disabled={updatingVotes ? true : false}
                    onClick={() => {onLikeBtnClick(songWithComments._id)}}
                  >
                    <div className="text-sm flex items-center gap-1 amb">
                      <Star className={`w-4 h-4 ${userHasVoted ? 'fill-amber-500' : 'fill-white'}`}/> 
                      <span>{userHasVoted ? 'Dislike' : 'Like'}</span>
                    </div>
                  </Button>
                }
              </div>
            </div>
          </div>
        </div>
        {/* Comments area */}
        <div className=" mt-2 bg-zinc-900 rounded-lg">
          <div className="flex justify-between items-center p-2">
            <div className="flex items-start">Recent comments</div>
            <Link to={`/songs/comments/${songId}`}>
              <span className="text-xs hover:underline cursor-pointer">{showMoreComments()}</span>
            </Link>   
          </div>
          {/* Messages */}
          <div className='h-[calc(100vh-478px)] sm:h-[calc(100vh-486px)]'>
            {commentsLimitedTo4.length == 0 ?
              <EmptyBox 
              title="No comments exist" 
              description="Start by typing one!" 
              icon= {<MessageCircleMore className="w-18 h-18" />}
              /> : ''
            }
            <div className='px-4 space-y-3'>
              {commentsLimitedTo4.map(comment => (
                <div
                  key={comment._id}
                  className={`flex items-start gap-3 
                    ${userIsAuthor(comment.sender._id) ? 'flex-row-reverse' : ''}
                  `}
                >
                  <div className={`flex flex-col items-center text-center ${userIsAuthor(comment.sender._id) ? 'text-teal-700' : ''}`}>
                    <UserCircle2 className="size-8" />
                    <span className="text-sm">
                      {userIsAuthor(comment.sender._id) ? 'You' : comment.sender.username}
                    </span>  
                  </div>   
                  <div
                    className={`rounded-lg p-1.5 w-full
                      ${userIsAuthor(comment.sender._id) ? 'bg-teal-800' : 'bg-zinc-800'}
                    `}
                  >
                    <p className='text-sm'>{comment.message}</p>
                    <span className='text-xs text-zinc-300 mt-1 block'>
                      {new Date(comment.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <CommentsInput />
        </div>
    </ScrollArea>
  )
}

export default SongsPage
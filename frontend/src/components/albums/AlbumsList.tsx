import { Link } from "react-router";

type Props = { albums: any[] };

const AlbumsList = ({albums}:Props) => {
  return albums.map((albumItem) => (
      <Link to={`albums/${albumItem._id}`} 
        key={albumItem._id}
        className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
      >
        <div className='flex flex-col flex-1 min-w-0'>
          <p className='font-medium max-md:text-sm truncate grow'>{albumItem.title}</p>
          <p className='text-xs max-md:text-[0.65rem] italic text-zinc-400 truncate grow'>produced in {albumItem.releasedYear}</p>
        </div> 
      </Link>
    ))
             
  
}

export default AlbumsList
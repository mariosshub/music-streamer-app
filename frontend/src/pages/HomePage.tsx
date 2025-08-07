import ActionButtons from "@/components/home/ActionButtons";
import SectionWithSongsGrid from "@/components/home/SectionWithSongsGrid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/providers/AuthProvider";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";

const HomePage = () => {
  const {loggedInUser} = useAuth();
  const {isLoading, 
    top5Songs, fetchTop5Songs, 
    topSongsByGenre, fetchTopSongsByGenre, 
    recentlyReleasedSongs, fetchRecentlyReleasedSongs
  } = useMusicStore();

  useEffect(() => {
    fetchTop5Songs();
    fetchTopSongsByGenre("rock");
    fetchRecentlyReleasedSongs();
  }, [fetchTop5Songs, fetchTopSongsByGenre, fetchRecentlyReleasedSongs])

  return (
    <main className="rounded-md overflow-hidden h-full bg-zinc-900">
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>Welcome back {loggedInUser?.username}</h1>
          <ActionButtons />
					<div className='space-y-8'>
						<SectionWithSongsGrid sectionId="top_5_songs" title='Top 5 songs among users' songs={top5Songs} isLoading={isLoading} />
						<SectionWithSongsGrid sectionId="top_rock_songs" title='Top rock songs' songs={topSongsByGenre} isLoading={isLoading} />
						<SectionWithSongsGrid sectionId="recently_uploaded" title='Recently uploaded' songs={recentlyReleasedSongs} isLoading={isLoading} />
					</div>
				</div>
      </ScrollArea>
    </main>
  )
}

export default HomePage
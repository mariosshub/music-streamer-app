import DiscoverAlbums from "@/components/discover/DiscoverAlbums"
import DiscoverSongs from "@/components/discover/DiscoverSongs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchStore } from "@/stores/useSearchStore"

const DiscoverPage = () => {
  const {selectedTab, setSelectedTab} = useSearchStore();

  return (
    <main className="rounded-md overflow-hidden h-full p-2 bg-zinc-900">
      <Tabs value={selectedTab} onValueChange={value => {setSelectedTab(value)}} >
        <TabsList>
          <TabsTrigger className="cursor-pointer" value="songs">Songs</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="albums">Albums</TabsTrigger>
        </TabsList>
        <TabsContent className="bg-zinc-800/60 rounded-lg" value="songs">
          <DiscoverSongs />
        </TabsContent>
        <TabsContent forceMount className="bg-zinc-800/60 rounded-lg" value="albums">
          <DiscoverAlbums />
        </TabsContent>
      </Tabs>
      
    </main>
  )
}

export default DiscoverPage
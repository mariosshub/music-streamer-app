import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Outlet } from "react-router";
import LeftSidebar from "./components/LeftSidebar";
import AudioControls from "./components/AudioControls";
import NavBar from "@/components/Navbar/NavBar";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";

const MainLayout = () => {
  const isSmallScreen = useIsSmallScreen();

  return (
    <div className='h-screen bg-black text-white flex flex-col'>
      <NavBar />
      <ResizablePanelGroup direction="horizontal" className="flex-1 flex h-full overflow-hidden p-2">
        {/* left side bar */}
        <ResizablePanel defaultSize={20} minSize={isSmallScreen ? 10: 20} maxSize={30}>
          <LeftSidebar />
        </ResizablePanel>
        <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />
        {/* Main content */}
        <ResizablePanel defaultSize={isSmallScreen ? 90 : 80} minSize={70} maxSize={80}>
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>
      <AudioControls />
    </div>
  )
}

export default MainLayout
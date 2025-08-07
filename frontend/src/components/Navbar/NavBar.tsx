import { Link } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

const NavBar = () => {
  const {isLoggedIn, loggedInUser, logout} = useAuth();

  return (
    <nav className="rounded-lg border-b border-stone-600/20 overflow-hidden p-2 mx-auto w-screen bg-zinc-900">
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center space-x-20">
          <Link to={isLoggedIn ? "/home" : "/"}>
            <div className="font-sans antialiased text-sm text-current font-semibold hover:text-darkBlue">Music Streamer App</div>
          </Link>
        </div>
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <span className="hover:underline cursor-pointer">
                {loggedInUser?.username}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{loggedInUser?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="lg:flex items-center space-x-6 text-white">
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 font-bold rounded-md bg-teal-800 hover:opacity-70"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
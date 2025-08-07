import NavBar from "@/components/Navbar/NavBar"
import { useAuth } from "@/providers/AuthProvider"
import { Link } from "react-router";

const WelcomePage = () => {
  const {isLoggedIn} = useAuth();

  return (
    <section className="bg-gradient-to-b from-[#005f5a]/80 via-teal-920/80 to-zinc-900">
      <NavBar />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <h1 className="text-white font-semibold text-4xl">Welcome to the Music Streamer App</h1>
        {!isLoggedIn ? 
          <p className="m-4 text-md font-sans italic text-gray-200">Join our community for music sharing and upload your tracks now! </p>
        :
        <Link to={"/home"} >
          <div className="flex items-center justify-center gap-2 m-4 p-2 rounded-lg bg-teal-600 hover:bg-teal-700">
            <span className="text-2xl md:inline">Enter app</span>
          </div>
        </Link>
        }
      </div>
    </section>
  )
}

export default WelcomePage
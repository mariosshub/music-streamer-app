import { useAuth } from "@/providers/AuthProvider";
import { Ellipsis } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const LoggingOutPage = () => {
  const {isLoggedIn} = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    setTimeout(() => {
      if(!isLoggedIn){
        navigate("/login", {replace: true})
      }
    }, 2000)
  },[])

  return (
    <div className='h-screen bg-neutral-900 flex items-center justify-center'>
      <div className='text-center space-y-8 px-4'>
        <div className='flex justify-center animate-pulse'>
          <Ellipsis className='h-18 w-18 text-teal-500' />
        </div>
        <div className='space-y-4'>
          <h1 className='text-3xl font-bold text-white'>Logging you out</h1>
          <h2 className='text-xl font-semibold text-white'>Please wait</h2>
        </div>
      </div>
    </div>
  );
}

export default LoggingOutPage
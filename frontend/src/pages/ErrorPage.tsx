import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { Home, Music } from "lucide-react";
import { useNavigate } from "react-router"

const ErrorPage = ({title, description, status}: {title:string, description: string, status: string}) => {
  const navigate = useNavigate();
  const {isLoggedIn} =  useAuth();
  return (
		<div className='h-screen bg-neutral-900 flex items-center justify-center'>
			<div className='text-center space-y-8 px-4'> 
				<div className='flex justify-center animate-bounce'>
					<Music className='h-24 w-24 text-teal-500' />
				</div>
				{/* Error message */}
				<div className='space-y-4'>
					<h1 className='text-7xl font-bold text-white'>{status}</h1>
					<h2 className='text-2xl font-semibold text-white'>{title}</h2>
					<p className='text-neutral-400 max-w-md mx-auto'>
						{description}
					</p>
				</div>

				{/* Action buttons */}
				<div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-8'>
					<Button
						onClick={() => navigate(-1)}
						variant='outline'
						className='bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 w-full sm:w-auto'
					>
						Go Back
					</Button>
					<Button
						onClick={() => isLoggedIn ? navigate("/home") : navigate("/")}
						className='bg-teal-500 hover:bg-teal-600 text-white w-full sm:w-auto'
					>
						<Home className='mr-2 h-4 w-4' />
						Back to Home
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ErrorPage
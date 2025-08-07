import { LoaderCircle } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className='h-screen bg-neutral-900 flex items-center justify-center'>
      <div className='text-center space-y-8 px-4'>
        <div className='flex justify-center animate-spin'>
          <LoaderCircle className='h-18 w-18 text-teal-500' />
        </div>
        <div className='space-y-4'>
          <h1 className='text-3xl font-bold text-white'>Loading...</h1>
          <h2 className='text-xl font-semibold text-white'>Please wait</h2>
        </div>
      </div>
    </div>
  );
}

export default LoadingPage
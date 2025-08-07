import { ReactNode } from 'react'

type Props = {
  title: string,
  description: string,
  icon: ReactNode // the lucide-react icon 
}

const EmptyBox = ({title, description, icon}:Props) => {
  return (
    <div className='flex flex-col items-center justify-center h-full space-y-6'>
      {icon}
      <div className='text-center'>
        <h3 className='text-zinc-300 md:text-lg md:font-medium mb-1'>{title}</h3>
        <p className='text-zinc-500 text-sm'>{description}</p>
      </div>
	  </div>
  )
}

export default EmptyBox
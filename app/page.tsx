import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Home = () => {
  return (
    <div className='flex flex-col h-screen w-full items-center justify-center gap-y-5 bg-slate-300'>
    <div className='text-3xl font-bold'>
      Home
    </div>
    <Button asChild> 
      <Link href={'/hrportal'}>Go to Dashboard </Link>
      </Button>
    </div>
  )
}

export default Home

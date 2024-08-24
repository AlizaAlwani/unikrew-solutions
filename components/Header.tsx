import { UserButton } from '@clerk/nextjs';
import {UserResource} from '@clerk/types';
import Link from 'next/link';

interface HeaderProps {
    user: UserResource | null | undefined;
}


const Header = ({user}: HeaderProps) => {
  return (
    <div>
        <div className='h-[100px] w-auto bg-slate-800 gap-y-5 text-white shadow-lg flex justify-between py-5 px-5 '>
            <div>
                <h1 className='mt-[16px]'>Logo</h1>
            </div>
            <div className='flex gap-3'>
                <div className='mt-[17px] flex flex-row gap-x-3' >
            <h1 > Welcome </h1>
            <Link href={'/profile'}>
                {user?. username}
                </Link>
                </div>
            <UserButton afterSignOutUrl='/home'/>
            

            </div>
            

        </div>
    </div>
  )
}

export default Header

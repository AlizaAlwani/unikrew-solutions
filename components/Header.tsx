import { UserButton } from '@clerk/nextjs';
import { UserResource } from '@clerk/types';
import Image from 'next/image';
import Link from 'next/link';
import unikrewlogo from '@/public/newlogo.png'

interface HeaderProps {
  user: UserResource | null | undefined;
}

const Header = ({ user }: HeaderProps) => {
  return (
    <div className="w-full bg-[#1A1A1D] text-white shadow-lg py-3 px-3 fixed">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center h-[25px]">
        <div>
        <Image src={unikrewlogo} alt="unikrew logo" width={70} />
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex gap-x-2">
            <h1 className="text-md font-thin">Welcome</h1>
            <Link href={'/profile'} className="text-md font-thin">
              {user?.fullName}
            </Link>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}

export default Header;

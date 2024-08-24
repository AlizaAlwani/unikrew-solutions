import { UserButton } from '@clerk/nextjs';
import { UserResource } from '@clerk/types';
import Image from 'next/image';
import Link from 'next/link';
import unikrewlogo from '@/public/logouni.png'

interface HeaderProps {
  user: UserResource | null | undefined;
}

const Header = ({ user }: HeaderProps) => {
  return (
    <div className="w-full bg-slate-800 text-white shadow-lg py-3 px-3">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center h-[25px]">
        <div>
        <Image src={unikrewlogo} alt="unikrew logo" width={70} />
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex gap-x-3">
            <h1 className="text-md">Welcome</h1>
            <Link href={'/profile'} className="text-lg font-medium">
              {user?.username}
            </Link>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}

export default Header;

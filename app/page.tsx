"use client";
import Link from 'next/link';
import Image from 'next/image';
import creditcard from '@/public/creditcard.png';
import unikrewlogo from '@/public/logouni.png';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        // Typing effect
        await controls.start({ width: '100%', transition: { duration: 2 } });
        // Wait for 20 seconds
        await new Promise(resolve => setTimeout(resolve, 20000));
        // Erasing effect
        await controls.start({ width: '0%', transition: { duration: 1 } });
      }
    };

    sequence();
  }, [controls]);

  return (
    <div className="relative flex h-screen bg-[#1A1A1D] px-16">
      {/* Header with Logo and Navigation */}
      <div className="absolute top-5 left-5">
        <Image src={unikrewlogo} alt="unikrew logo" />
      </div>
      <div className="absolute top-5 right-5 flex space-x-4">
      <Button asChild className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 hover:scale-105 transition duration-200 ease-in-out">
          <Link href={'/hrportal'}>Sign-in</Link>
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex w-full h-full items-center px-16">
        {/* Left Side - Text and Heading */}
        <div className="flex flex-col justify-center items-start text-slate-400 w-1/2 space-y-6">
          <motion.h2 
            className="text-5xl font-bold overflow-hidden border-r-2 border-white whitespace-nowrap"
            animate={controls}
            initial={{ width: '0%' }}
          >
            UNIKREW SOLUTIONS
          </motion.h2>
          <p className="text-lg text-white max-w-lg">
            From generating pay slips to checking employee balances, everything is just a single click away.
          </p>
          <Button className="mt-4 bg-yellow-500 text-white px-6 py-3 rounded-full hover:bg-yellow-600 hover:scale-105 transition duration-300 ease-in-out flex justify-center">
            HR Portal
          </Button>
        </div>

        {/* Right Side - Credit Card Image */}
        <div className="flex justify-center items-center w-1/2">
          <Image 
            src={creditcard}
            alt="Credit Card"
            width={550}
            height={400}
            className="drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

"use client";
import Link from 'next/link';
import Image from 'next/image';
import creditcard from '@/public/creditcard.png';
import unikrewlogo from '@/public/logouni.png';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const controls = useAnimation();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let isMounted = true;

    const startAnimationSequence = async () => {
      if (!isMounted) return;

      try {
        while (true) {
          await controls.start({ width: '100%', transition: { duration: 2 } });
          await new Promise(resolve => setTimeout(resolve, 20000));
          await controls.start({ width: '0%', transition: { duration: 1 } });
        }
      } catch (error) {
        console.error("Animation error:", error);
      }
    };

    startAnimationSequence();

    return () => {
      isMounted = false;
    };
  }, [controls]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY } = e;
    setPosition({
      x: (clientX / window.innerWidth) * 20 - 10,
      y: (clientY / window.innerHeight) * 20 - 10,
    });
  };

  return (
    <div className="relative flex h-screen bg-[#1A1A1D] px-16" onMouseMove={handleMouseMove}>
      <div className="absolute top-5 left-5">
        <Image src={unikrewlogo} alt="unikrew logo" />
      </div>
      <div className="absolute top-5 right-5 flex space-x-4">
        <Link href="/hrportal">
          <Button className="bg-yellow-500 text-white px-4 py-2 font-bold rounded-full hover:bg-yellow-600 hover:scale-105 transition duration-200 ease-in-out">
            Sign-in
          </Button>
        </Link>
      </div>

      <div className="flex w-full h-full items-center px-16">
        <div className="flex flex-col justify-center items-start text-slate-400 w-1/2 space-y-6">
          <motion.h2
            className="text-5xl font-bold overflow-hidden border-r-2 border-white"
            animate={controls}
            initial={{ width: '0%' }}
          >
            UNIKREW SOLUTION
          </motion.h2>
          <p className="text-lg text-white/70 font-mono max-w-full leading-tight">
            <span className="inline-block align-baseline">
              From generating pay slips to checking employee balances,
            </span>
            <br />
            <span className="inline-block align-baseline">
              everything is just a single click away.
            </span>
          </p>
          <Button className="mt-4 bg-yellow-500 text-white text-center font-bold px-6 py-3 rounded-full hover:bg-yellow-600 hover:scale-105 transition duration-300 ease-in-out flex justify-center">
            HR Portal
          </Button>
        </div>

        <motion.div
          className="flex justify-center items-center w-1/2"
          animate={{ x: position.x, y: position.y }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Image
            src={creditcard}
            alt="Credit Card"
            width={550}
            height={400}
            className="drop-shadow-xl"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
import StationSignUpPage from './stationsignup/page';
import UserSignUpPage from './usersignup/page';
import UserLoginPage from './userlogin/page';
import StationLoginPage from './stationlogin/page';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async (token: string) => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/validate-token',
          { token }
        );
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return (
    <HeroHighlight>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [20, -5, 0] }}
        transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white leading-relaxed lg:leading-snug text-center mx-auto"
      >
        Supercharge your EV experience.
        <br /> Power up with BlockCharge
        <br />
        <Highlight className="text-black dark:text-white">
          where every charge fuels your journey.
        </Highlight>
        {!isLoggedIn && (
          <div className="flex my-4 gap-4 justify-center items-center mt-8">
            <UserSignUpPage />
            <StationSignUpPage />
            <UserLoginPage />
            <StationLoginPage />
          </div>
        )}
      </motion.h1>
    </HeroHighlight>
  );
}

'use client';
import { Button } from '@nextui-org/react';
import { LogoutIcon } from './icons';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      localStorage.removeItem('token');
      router.push('/');
    } else {
      console.log('Token Not found');
    }
  };

  return (
    <Button
      className="text-sm font-normal text-default-600 bg-default-100"
      variant="flat"
      startContent={<LogoutIcon className="text-primary" />}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}

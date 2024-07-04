'use client';
import { Button, Link } from '@nextui-org/react';
import { StationIcon } from '@/components/icons';

const StationSignUpButton = () => {
  return (
    <Button
      href="/stationsignup"
      as={Link}
      isExternal
      className="text-sm font-normal text-default-600 bg-default-100"
      variant="flat"
      startContent={<StationIcon className="text-primary" />}
    >
      Sign up as Station
    </Button>
  );
};

export default StationSignUpButton;

import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
} from '@nextui-org/react';
import { ConnectedIcon } from './icons';

export default function IOTCard() {
  const registrationNumber: number = 123456789;
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <ConnectedIcon />
        <div className="flex flex-col">
          <p className="text-md">IOT Device</p>
          <p className="text-small text-default-500">{registrationNumber}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>Connect IOT to Monitor Battery Status</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href="https://github.com/nextui-org/nextui"
        >
          Visit source code on GitHub.
        </Link>
      </CardFooter>
    </Card>
  );
}

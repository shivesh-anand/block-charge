import React, { useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
} from '@nextui-org/react';
import { ConnectedIcon } from './icons';

interface IOTCardProps {
  currentLevel: number;
  onChangeLevel: (level: number) => void;
}

const IOTCard: React.FC<IOTCardProps> = ({ currentLevel, onChangeLevel }) => {
  const registrationNumber: number = 123456789;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Handle empty input case
    if (value === '') {
      onChangeLevel(0); // Set a default value, e.g., 0
      return;
    }

    // Check if the value is a valid number and within the range of 0-100
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
      onChangeLevel(numericValue);
    }
  };

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
        <Input
          type="number"
          label="Battery Level"
          placeholder="Enter Battery Level between 0-100"
          value={currentLevel === 0 ? '' : currentLevel.toString()} // Display empty string if level is 0, otherwise display current level
          onChange={handleInputChange}
        />
      </CardFooter>
    </Card>
  );
};

export default IOTCard;

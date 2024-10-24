import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import React from "react";
import { BatteryIcon } from "./icons.tsx";
import IOTCard from "./IOTCard.tsx";

interface BatteryButtonProps {
  level: number;
  onChangeLevel: (level: number) => void;
}

const BatteryButton: React.FC<BatteryButtonProps> = ({
  level,
  onChangeLevel,
}) => {
  const getGradientClass = (level: number) => {
    if (level > 75) return "from-green-400 to-green-600";
    if (level > 50) return "from-yellow-400 to-yellow-600";
    if (level > 25) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  const gradientClass = getGradientClass(level);

  return (
    <Popover placement="bottom" showArrow offset={10} shadow="lg">
      <PopoverTrigger>
        <Button
          startContent={<BatteryIcon />}
          radius="full"
          className={`bg-gradient-to-r ${gradientClass} text-white shadow-lg`}
        >
          {level}%
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        <div className="px-1 py-2 w-full">
          <IOTCard currentLevel={level} onChangeLevel={onChangeLevel} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BatteryButton;

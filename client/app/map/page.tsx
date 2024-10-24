"use client";
import BatteryButton from "@/components/BatteryButton";
import withAuth from "@/components/withAuth";
import dynamic from "next/dynamic";
import { useState } from "react";

const Maps = dynamic(() => import("@/components/Map"), { ssr: false });

function MapsPage() {
  const [batteryLevel, setBatteryLevel] = useState(50);
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="z-0 items-center justify-center">
        <Maps />
      </div>
      {/* <div className="absolute inset-x-0 bottom-10 flex justify-center items-center z-10">
        <SearchBar />
      </div> */}

      <div className="absolute bottom-10 right-40 flex justify-center items-center z-10">
        <BatteryButton level={batteryLevel} onChangeLevel={setBatteryLevel} />
      </div>
    </section>
  );
}

export default MapsPage;

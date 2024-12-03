"use client";

import Queue from "@/components/Queue";
import StatsPage from "@/components/StatsPage";
import TransactionHistory from "@/components/TransactionHistory";
import UpdatePrices from "@/components/UpdatePrices";
import UpdateProfile from "@/components/UpdateProfile";
import { Tab, Tabs } from "@nextui-org/react";

export default function UpdateStationForm() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Tabs aria-label="Options">
        <Tab key="queue" title="Queue">
          <Queue />
        </Tab>

        <Tab key="history" title="Blockchain Transactions">
          <TransactionHistory />
        </Tab>

        <Tab key="update" title="Update Profile">
          <UpdateProfile />
        </Tab>
        <Tab key="prices" title="Update Prices">
          <UpdatePrices />
        </Tab>
        <Tab key="stats" title="Statistics">
          <StatsPage />
        </Tab>
      </Tabs>
    </div>
  );
}

"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdatePrices() {
  const [selectedChargerTypes, setSelectedChargerTypes] = useState<string[]>(
    []
  );
  const [prices, setPrices] = useState<{ [key: string]: string }>({
    "Type 1": "5",
    "Type 2": "10",
  });
  const [loading, setLoading] = useState(false);

  const chargers = [
    { key: "Type 1", label: "Type 1" },
    { key: "Type 2", label: "Type 2" },
    { key: "CHAdeMO", label: "CHAdeMO" },
    { key: "CCS combo type 1", label: "CCS combo type 1" },
    { key: "CCS combo type 2", label: "CCS combo type 2" },
  ];

  const updatePricesHandler = async () => {
    setLoading(true);
    try {
      const formattedPrices = selectedChargerTypes.map((key) => ({
        type: key,
        price: prices[key] || "",
      }));

      // Simulate API call for updating prices
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/station/update-prices`,
        formattedPrices
      );

      toast.success("Prices updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update prices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="font-extrabold text-5xl text-center justify-center items-center">
        Update Prices
      </CardHeader>
      <CardBody>
        {/* Charger Type Selection */}
        <div>
          <label className="font-medium">Select Charger Types</label>
          <div className="flex gap-2 flex-wrap mt-2">
            {chargers.map((charger) => (
              <button
                key={charger.key}
                onClick={() =>
                  setSelectedChargerTypes((prev) =>
                    prev.includes(charger.key)
                      ? prev.filter((type) => type !== charger.key)
                      : [...prev, charger.key]
                  )
                }
                className={`px-4 py-2 rounded-lg ${
                  selectedChargerTypes.includes(charger.key)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {charger.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Price Inputs */}
        <div className="mt-4">
          {selectedChargerTypes.map((key) => (
            <div key={key} className="flex flex-col gap-2 mb-4">
              <label htmlFor={`price-${key}`} className="font-medium">
                {chargers.find((c) => c.key === key)?.label} Price (₹/min)
              </label>
              <Input
                id={`price-${key}`}
                type="text"
                placeholder="Enter Price in ₹/min"
                value={prices[key] || ""}
                onChange={(e) =>
                  setPrices({ ...prices, [key]: e.target.value })
                }
                isRequired
              />
            </div>
          ))}
        </div>
        <Button
          onPress={updatePricesHandler}
          isLoading={loading}
          color="primary"
        >
          Update Prices
        </Button>
      </CardBody>
    </Card>
  );
}

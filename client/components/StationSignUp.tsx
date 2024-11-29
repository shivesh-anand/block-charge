"use client";

import { login } from "@/redux/slice/authSlice";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { APIProvider } from "@vis.gl/react-google-maps";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { PlaceAutocompleteClassic } from "./PlaceAutocompleteClassic";

const StationSignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stationName, setStationName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedChargerTypes, setSelectedChargerTypes] = useState<string[]>(
    []
  );
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [placeId, setPlaceId] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const chargers = [
    { key: "Type 1", label: "Type 1" },
    { key: "Type 2", label: "Type 2" },
    { key: "CHAdeMO", label: "CHAdeMO" },
    { key: "CCS combo type 1", label: "CCS combo type 1" },
    { key: "CCS combo type 2", label: "CCS combo type 2" },
  ];

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place) {
      setLocation(place.formatted_address!);
      setPlaceId(place.place_id!);
    }
  };

  const handlePriceChange = (key: string, value: string) => {
    setPrices((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedChargers = selectedChargerTypes.map((key) => ({
        type: key,
        price: prices[key] || "",
      }));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register/station`,
        {
          stationName,
          email,
          password,
          location,
          chargers: formattedChargers,
          placeId,
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        dispatch(login(response.data.token));
        router.push("/map");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <Input
        label="Station Name"
        value={stationName}
        onChange={(e) => setStationName(e.target.value)}
        isDisabled={loading}
        isRequired
      />
      <Input
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        isDisabled={loading}
        isRequired
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isDisabled={loading}
        isRequired
      />
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}>
        <PlaceAutocompleteClassic
          onPlaceSelect={handlePlaceSelect}
          placeholder={"Enter exact charging station location"}
        />
      </APIProvider>
      <Select
        label="Charger Types"
        selectionMode="multiple"
        placeholder="Select chargers"
        selectedKeys={new Set(selectedChargerTypes)} // Ensure controlled component
        onSelectionChange={(keys) =>
          setSelectedChargerTypes(Array.from(keys as Set<string>))
        }
      >
        {chargers.map((option) => (
          <SelectItem key={option.key} value={option.key}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
      {/* Dynamic inputs for charger prices */}
      {Array.from(selectedChargerTypes).map((key) => {
        const charger = chargers.find((charger) => charger.key === key);
        if (!charger) return null;

        return (
          <div key={key} className="flex flex-col gap-2 mb-4">
            <label htmlFor={`price-${key}`} className="font-medium">
              {charger.label} Price (₹/min)
            </label>
            <Input
              id={`price-${key}`}
              type="text"
              placeholder="Enter Price in ₹/min"
              value={prices[key] || ""}
              onChange={(e) => handlePriceChange(key, e.target.value)}
              isRequired
            />
          </div>
        );
      })}
      <Button type="submit" isLoading={loading}>
        Sign Up
      </Button>
    </form>
  );
};

export default StationSignUpForm;

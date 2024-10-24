"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { APIProvider } from "@vis.gl/react-google-maps";
import { PlaceAutocompleteClassic } from "./PlaceAutocompleteClassic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { login } from "@/redux/slice/authSlice";

const StationSignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stationName, setStationName] = useState("");
  const [location, setLocation] = useState("");
  const [chargerTypes, setChargerTypes] = useState<string[]>([]);
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
      console.log(place.place_id);
      setLocation(place.formatted_address!);
      setPlaceId(place.place_id!);
      console.log("Selected Place ID:", place.place_id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register/station`,
        {
          stationName,
          email,
          password,
          location,
          chargerTypes,
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
        name="stationName"
        placeholder="John"
        variant="bordered"
        isRequired
        value={stationName}
        onChange={(e) => setStationName(e.target.value)}
        isDisabled={loading}
      />
      <Input
        label="Email"
        name="email"
        placeholder="Enter your email"
        variant="bordered"
        isRequired
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        isDisabled={loading}
      />
      <Input
        label="Password"
        name="password"
        placeholder="Enter your password"
        type="password"
        variant="bordered"
        isRequired
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isDisabled={loading}
      />
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
      >
        <PlaceAutocompleteClassic
          placeholder="Enter a valid location"
          onPlaceSelect={handlePlaceSelect}
        />
      </APIProvider>
      <Select
        label="Charger Types"
        selectionMode="multiple"
        placeholder="Select all chargers available and specify price/minutes"
        className="mb-4"
        isRequired
        onSelect={(e) =>
          setChargerTypes(
            Array.from(
              (e.target as HTMLSelectElement).selectedOptions,
              (option) => option.value
            )
          )
        }
        value={chargerTypes}
      >
        {chargers.map((charger) => (
          <SelectItem key={charger.key} value={charger.key}>
            {charger.label}
          </SelectItem>
        ))}
      </Select>
      {/* <p className="text-small text-default-500 mb-4">
        Selected: {Array.from(values).join(", ")}
      </p> */}
      <Button
        className="font-bold text-lg "
        size="lg"
        type="submit"
        variant="shadow"
        color="primary"
        isLoading={loading}
      >
        Sign Up
      </Button>
    </form>
  );
};

export default StationSignUpForm;

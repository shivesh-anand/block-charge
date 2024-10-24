"use client";

import { login } from "@/redux/slice/authSlice";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const UserSignUpForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const vehicles = [
    { key: "Tata", label: "Tata" },
    { key: "Mahindra", label: "Mahindra" },
    { key: "Ola", label: "Ola" },
    { key: "Hyundai", label: "Hyundai" },
    { key: "MG", label: "MG" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisableButton(true);
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}http://localhost:5000/api/auth/register/user`,
        {
          firstName,
          lastName,
          email,
          password,
          vehicleNumber,
          vehicleType,
        }
      );

      console.log(response);
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
      setDisableButton(false);
      setLoading(false);
    }
  };
  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <div className="flex flex-row gap-4">
        {" "}
        <Input
          label="First Name"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="John"
          variant="bordered"
          isDisabled={disableButton}
          isRequired
        />
        <Input
          label="Last Name"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Doe"
          variant="bordered"
          isDisabled={disableButton}
          isRequired
        />
      </div>

      <Input
        label="Email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        variant="bordered"
        isDisabled={disableButton}
        isRequired
      />
      <Input
        label="Password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        type="password"
        variant="bordered"
        isDisabled={disableButton}
        isRequired
      />
      <Input
        label="Vehicle Number"
        name="vehicleNumber"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
        placeholder="JH05AJ1234"
        type="password"
        variant="bordered"
        isDisabled={disableButton}
        isRequired
      />
      <Select
        id="vehicleType"
        label="Vehicle Type"
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value)}
        placeholder="Select Vehicle Type"
        isDisabled={disableButton}
        isRequired
      >
        {vehicles.map((vehicle) => (
          <SelectItem key={vehicle.key} value={vehicle.label}>
            {vehicle.label}
          </SelectItem>
        ))}
      </Select>

      <Button
        className="font-bold text-lg "
        size="lg"
        type="submit"
        variant="shadow"
        color="primary"
        isDisabled={disableButton}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </form>
  );
};

export default UserSignUpForm;

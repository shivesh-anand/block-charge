"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdateProfile() {
  const [profileData, setProfileData] = useState({
    stationName: "Default Station Name",
    email: "station@example.com",
    location: "Default Location",
  });
  const [loading, setLoading] = useState(false);

  const updateProfileHandler = async () => {
    setLoading(true);
    try {
      // Simulate API call for updating profile
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/station/update-profile`,
        profileData
      );
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="font-extrabold text-5xl text-center justify-center items-center">
        Update Profile
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-4">
          <Input
            label="Station Name"
            value={profileData.stationName}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                stationName: e.target.value,
              })
            }
          />
          <Input
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
          />
          <Input
            label="Location"
            value={profileData.location}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                location: e.target.value,
              })
            }
          />
          <Button
            onPress={updateProfileHandler}
            isLoading={loading}
            color="primary"
          >
            Update Profile
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

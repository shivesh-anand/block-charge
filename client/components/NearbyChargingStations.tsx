"use client";
import {
  PlaceDirectionsButton,
  PlaceOverview,
} from "@googlemaps/extended-component-library/react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { InfoWindow, Marker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import axios from "axios";

export default function NearbyChargingStations({
  center,
}: {
  center: { lat: number; lng: number };
}) {
  const [chargingStations, setChargingStations] = useState<any[]>([]);
  const [selectedStation, setSelectedStation] = useState<any | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const map = useMap();
  const [queue, setQueue] = useState<number>(0);
  const [stationData, setStationData] = useState<any>(null);
  const Socket: any = useRef();

  useEffect(() => {
    const fetchChargingStations = async () => {
      try {
        const response = await fetch(
          "https://places.googleapis.com/v1/places:searchNearby",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": process.env
                .NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string,
              "X-Goog-FieldMask":
                "places.id,places.location,places.name,places.displayName,places.evChargeOptions,places.formattedAddress,places.rating",
            },
            body: JSON.stringify({
              includedTypes: ["electric_vehicle_charging_station"],
              maxResultCount: 10,
              locationRestriction: {
                circle: {
                  center: {
                    latitude: center.lat,
                    longitude: center.lng,
                  },
                  radius: 20000.0,
                },
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Charging Stations:", data);

        setChargingStations(data.places);
      } catch (error) {
        console.error("Error fetching charging stations:", error);
      }
    };

    if (map) {
      fetchChargingStations();
    }
  }, [map, center]);

  const handleMarkerClick = async (station: any) => {
    console.log("station from handlemarker click", station);
    setSelectedStation(station);
    const stationData = await fetchStationData(station.id);
    setStationData(stationData);
  };

  const closeInfoWindow = () => {
    setSelectedStation(null);
  };

  const fitMapToBounds = () => {
    if (!map || !chargingStations || chargingStations.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    chargingStations.forEach((station) => {
      bounds.extend(
        new window.google.maps.LatLng(
          station.location.latitude,
          station.location.longitude
        )
      );
    });
    map.fitBounds(bounds);
  };

  useEffect(() => {
    fitMapToBounds();
  }, [chargingStations, map]);

  const formatConnectorType = (type: string): string => {
    switch (type) {
      case "EV_CONNECTOR_TYPE_CHADEMO":
        return "CHAdeMO";
      case "EV_CONNECTOR_TYPE_CCS_COMBO_2":
        return "CCS Combo 2";
      case "EV_CONNECTOR_TYPE_TYPE_2":
        return "Type 2";
      default:
        return type;
    }
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5001');
    Socket.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ from: '674b99bc35b111c33ef33dce', to: '668634e5158bf29d41fc6bbf', text: 'Initialize', type: 'User' }));
    };

    ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data); 
        if(data.success === true) {
          alert(`Verified at station: ${data.from} successfully`);
        } else {
          alert(`Verification at station: ${data.from} was unsuccessfully`);
        }
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    }

    return () => {
      ws.close();
      Socket.current = null;
    }
  }, []);

  const fetchStationData = async (placeId: string) => {
    try {
      const token = localStorage.getItem("token");
      console.log(placeId);
      const response = await axios.get(
        `http://localhost:5000/api/stations/station/place/${placeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response);
      const data = await response.data;
      setQueue(data.queue);
      
      return data;
    } catch (error) {
      console.error("Error fetching station data:", error);
    }
  };

  // function handleCheckIn(e: any): void {
  //   // Implement the check-in logic here
  //   console.log("Check-in button pressed");
  // }

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/validate-token",
        { token }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const sendMessage = async () => {
    const token = localStorage.getItem("token");
    const stationId = "668634e5158bf29d41fc6bbf"; 

    console.log(token);
  
    if (!token) {
      toast.error("User is not authenticated");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/queue/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ userId: '674b99bc35b111c33ef33dce', stationId: stationId }), 
      });
  
      const result = await response.json();
  
      if (response.ok) {
        if (Socket.current && Socket.current.readyState === WebSocket.OPEN) {
          Socket.current.send(
            JSON.stringify({
              from: '674b99bc35b111c33ef33dce',
              to: stationId,
              text: "verify",
              type: "User",
            })
          );
          toast.success("Item added and verification message sent");
        } else {
          console.warn("WebSocket is not ready");
          toast.error("WebSocket connection is not established");
        }
      } else if (response.status === 400) {
        toast.error("You are already in the queue. Please wait for your turn.");
      } else {
        toast.error(result.message || "Failed to add the item");
      }
    } catch (error: any) {
      console.error("Error during item addition:", error);
      toast.error("An error occurred while adding the item");
    }
  };
  
  const handleCheckIn = async () => {
    const token = localStorage.getItem("token");
    console.log("token", token);
    if (!token) {
      console.error("No token found");
      return;
    }
    const userData = await fetchUserData(token);
    if (!userData) {
      console.error("Invalid token");
      return;
    }
    console.log("userdata", userData);
    const user = userData.user;
    const checkInData = {
      placeId: selectedStation.id,
      email: userData.user.email,
      vehicleType: userData.user.vehicleType,
    };

    console.log("checkedInData", checkInData);

    try {
      await axios.post("http://localhost:5000/api/stations/add", checkInData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Check-in successful");
    } catch (error) {
      console.error("Error checking in:", error);
    }
    sendMessage();
  };

  return (
    <>
      {chargingStations &&
        chargingStations.map((station, index) => (
          <Marker
            key={station.id}
            position={{
              lat: station.location.latitude,
              lng: station.location.longitude,
            }}
            title={station.displayName.text}
            onClick={() => handleMarkerClick(station)}
          />
        ))}
      {selectedStation && (
        <InfoWindow
          position={{
            lat: selectedStation.location.latitude,
            lng: selectedStation.location.longitude,
          }}
          onCloseClick={closeInfoWindow}
        >
          <div className="p-4 text-gray-800 bg-white shadow-md rounded-lg text-left w-80 text-wrap">
            <h2 className="text-lg font-bold">
              {selectedStation.displayName.text}
            </h2>
            <p className="font-semibold">{selectedStation.formattedAddress}</p>
            {selectedStation.rating && (
              <p className="font-semibold text-medium">
                Rating: {selectedStation.rating}⭐
              </p>
            )}
            {selectedStation.evChargeOptions && (
              <div>
                <p className="font-semibold text-pretty text-medium">
                  Connector Count:{" "}
                  {selectedStation.evChargeOptions.connectorCount}
                </p>
                {selectedStation.evChargeOptions.connectorAggregation && (
                  <ul className="font-semibold text-medium text-wrap">
                    {selectedStation.evChargeOptions.connectorAggregation.map(
                      (connector: any, index: number) => (
                        <li key={index}>
                          {formatConnectorType(connector.type)}:{" "}
                          {connector.maxChargeRateKw / 1000} kW (
                          {connector.count} available)
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            )}
            {stationData && (
              <div>
                <p className="font-semibold text-medium text-wrap">
                  Queue: {queue}
                </p>
                <Button onClick={handleCheckIn}>Check In</Button>
              </div>
            )}
            <Button onPress={onOpen} className="mt-2">
              See Overview
            </Button>
          </div>
        </InfoWindow>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
        scrollBehavior="inside"
        placement="auto"
        className="bg-white"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black">
                {selectedStation?.displayName.text}
              </ModalHeader>
              <ModalBody className="w-full">
                <PlaceOverview
                  place={selectedStation.id}
                  size="x-large"
                  travelMode="driving"
                  className="w-full"
                >
                  <PlaceDirectionsButton slot="action">
                    Directions
                  </PlaceDirectionsButton>
                </PlaceOverview>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button onPress={sendMessage}>Check-In</Button>
    </>
  );
}

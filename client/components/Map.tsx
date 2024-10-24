"use client";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

import Directions from "./Directions.tsx";
import NearbyChargingStations from "./NearbyChargingStations.tsx";
import { PlaceAutocompleteClassic } from "./PlaceAutocompleteClassic.tsx";
import { fetchNearestChargingStation } from "./helpers.tsx";

export default function Maps() {
  const center = { lat: 23.3507, lng: 85.31377 };
  const [initialCenter, setInitialCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [origin, setOrigin] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [destination, setDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const isGoogleMapsLoaded = typeof google !== "undefined" && google.maps;

  const handleOriginSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place && place.geometry) {
      setOrigin({
        lat: place.geometry.location?.lat() || 0,
        lng: place.geometry.location?.lng() || 0,
      });
    }
  };

  const handleDestinationSelect = (
    place: google.maps.places.PlaceResult | null
  ) => {
    if (place && place.geometry) {
      setDestination({
        lat: place.geometry.location?.lat() || 0,
        lng: place.geometry.location?.lng() || 0,
      });
    }
  };

  useEffect(() => {
    if (!origin) {
      console.log("Trying to get user location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("User location found:", position);
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setInitialCenter(userLocation);
          setOrigin(userLocation);
        },
        (error) => {
          console.error("Error fetching user's location: ", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, [origin]);

  useEffect(() => {
    if (origin && !destination) {
      fetchNearestChargingStation(origin).then(
        (
          nearestStation:
            | { location: { latitude: number; longitude: number } }
            | null
            | undefined
        ) => {
          if (nearestStation) {
            setDestination({
              lat: nearestStation.location.latitude,
              lng: nearestStation.location.longitude,
            });
          }
        }
      );
    }
  }, [origin, destination]);

  return (
    <div className="relative h-[90vh] w-[100vw]">
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
      >
        <Map
          style={{ width: "100vw", height: "100vh" }}
          defaultCenter={origin || center}
          defaultZoom={10}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        />
        <div className="absolute top-20 left-4 z-10 p-4 flex flex-col space-y-4 w-80">
          <PlaceAutocompleteClassic
            placeholder="Enter origin"
            onPlaceSelect={handleOriginSelect}
          />
          <PlaceAutocompleteClassic
            placeholder="Enter destination"
            onPlaceSelect={handleDestinationSelect}
          />
        </div>
        {isGoogleMapsLoaded && origin && destination && (
          <Directions
            origin={new google.maps.LatLng(origin.lat, origin.lng)}
            destination={
              new google.maps.LatLng(destination.lat, destination.lng)
            }
          />
        )}

        <NearbyChargingStations center={destination || origin || center} />
      </APIProvider>
    </div>
  );
}

'use client';
import React, { useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
  useMapsLibrary,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  Button,
  Modal,
  Card,
  CardBody,
  CardHeader,
  ModalContent,
  useDisclosure,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@nextui-org/react'; // Adjust import based on your UI library
import {
  PlaceOverview,
  PlaceDirectionsButton,
  APILoader,
} from '@googlemaps/extended-component-library/react'; // Adjust import path as necessary

import { PlaceAutocompleteClassic } from './PlaceAutocompleteClassic'; // Adjust the import path as necessary

export default function Maps() {
  const center = { lat: 23.412182, lng: 85.439435 };
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

  const handleOriginSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place && place.geometry) {
      setOrigin({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const handleDestinationSelect = (
    place: google.maps.places.PlaceResult | null
  ) => {
    if (place && place.geometry) {
      setDestination({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  useEffect(() => {
    if (!origin) {
      console.log('Trying to get user location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('User location found:', position);
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

  // useEffect(() => {
  //   if (origin && !destination) {
  //     fetchNearestChargingStation(origin).then((nearestStation) => {
  //       if (nearestStation) {
  //         setDestination({
  //           lat: nearestStation.location.latitude,
  //           lng: nearestStation.location.longitude,
  //         });
  //       }
  //     });
  //   }
  // }, [origin, destination]);

  return (
    <div className="relative h-[90vh] w-[100vw]">
      <APILoader
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
        solutionChannel="GMP_GCC_placeoverview_v1_xl"
      />
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
      >
        <Map
          style={{ width: '100vw', height: '100vh' }}
          defaultCenter={origin || center}
          defaultZoom={10}
          // center={initialCenter || center}
          gestureHandling={'greedy'}
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
        <Directions origin={origin} destination={destination} />
        <NearbyChargingStations center={destination || origin || center} />
      </APIProvider>
    </div>
  );
}

interface DirectionsProps {
  origin: google.maps.LatLng | null;
  destination: google.maps.LatLng | null;
}

function Directions({ origin, destination }: DirectionsProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [map, routesLibrary]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination)
      return;

    directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });
  }, [directionsService, directionsRenderer, origin, destination]);

  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  return (
    <Card
      className="absolute left-10 bottom-10 flex justify-center items-center z-10 w-4/12 bg-background/60 dark:bg-default-100/50"
      isBlurred
    >
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h2 className="text-large font-bold text-left justify-start">
          Current Route: {selected.summary}
        </h2>
        <h4 className="text-md text-left justify-start">
          {leg.start_address} to {leg.end_address}
        </h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2 text-left justify-start">
        <p>Distance: {leg.distance?.text}</p>
        <p>Duration: {leg.duration?.text}</p>
        <h2 className="font-bold text-large">Other Routes:</h2>
        <ul className="flex flex-wrap gap-2">
          {routes.map((route, index) => (
            <div key={route.summary}>
              <Button
                size="sm"
                variant="faded"
                color="default"
                onClick={() => setRouteIndex(index)}
              >
                {route.summary}
              </Button>
            </div>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
function NearbyChargingStations({
  center,
}: {
  center: { lat: number; lng: number };
}) {
  const [chargingStations, setChargingStations] = useState<any[]>([]); // Define the type based on your JSON structure
  const [selectedStation, setSelectedStation] = useState<any | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Assuming useDisclosure is a custom hook or part of your UI library
  const map = useMap(); // Assuming useMap is a custom hook to get the map instance

  useEffect(() => {
    const fetchChargingStations = async () => {
      try {
        const response = await fetch(
          'https://places.googleapis.com/v1/places:searchNearby',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': process.env
                .NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string,
              'X-Goog-FieldMask':
                'places.id,places.location,places.name,places.displayName,places.evChargeOptions,places.formattedAddress,places.rating',
            },
            body: JSON.stringify({
              includedTypes: ['electric_vehicle_charging_station'],
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
        console.log('Charging Stations:', data); // Log the results to verify data

        setChargingStations(data.places);
      } catch (error) {
        console.error('Error fetching charging stations:', error);
      }
    };

    if (map) {
      fetchChargingStations();
    }
  }, [map, center]);

  // Function to handle marker click
  const handleMarkerClick = (station: any) => {
    setSelectedStation(station);
  };

  // Function to close info window
  const closeInfoWindow = () => {
    setSelectedStation(null);
  };

  // Function to fit map bounds to markers
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
    fitMapToBounds(); // Fit map bounds whenever chargingStations or map changes
  }, [chargingStations, map]);

  const formatConnectorType = (type: string): string => {
    switch (type) {
      case 'EV_CONNECTOR_TYPE_CHADEMO':
        return 'CHAdeMO';
      case 'EV_CONNECTOR_TYPE_CCS_COMBO_2':
        return 'CCS Combo 2';
      case 'EV_CONNECTOR_TYPE_TYPE_2':
        return 'Type 2';
      default:
        return type;
    }
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
          captureScroll={true}
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
                  Connector Count:{' '}
                  {selectedStation.evChargeOptions.connectorCount}
                </p>
                {selectedStation.evChargeOptions.connectorAggregation && (
                  <ul className="font-semibold text-medium text-wrap">
                    {selectedStation.evChargeOptions.connectorAggregation.map(
                      (connector: any, index: number) => (
                        <li key={index}>
                          {formatConnectorType(connector.type)}:{' '}
                          {connector.maxChargeRateKw / 1000} kW (
                          {connector.count} available)
                        </li>
                      )
                    )}
                  </ul>
                )}
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
    </>
  );
}

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
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { PlaceAutocompleteClassic } from './PlaceAutocompleteClassic'; // Adjust the import path as necessary

export default function Maps() {
  const center = { lat: 23.412182, lng: 85.439435 };
  const [origin, setOrigin] = useState<google.maps.LatLng | null>(null);
  const [destination, setDestination] = useState<google.maps.LatLng | null>(
    null
  );

  const handleOriginSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place && place.geometry) {
      setOrigin(place.geometry.location);
    }
  };

  const handleDestinationSelect = (
    place: google.maps.places.PlaceResult | null
  ) => {
    if (place && place.geometry) {
      setDestination(place.geometry.location);
    }
  };

  return (
    <div className="relative h-[90vh] w-[100vw]">
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
      >
        <Map
          style={{ width: '100vw', height: '100vh' }}
          defaultCenter={center}
          defaultZoom={10}
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
        <NearbyChargingStations center={destination} />
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
  center: google.maps.LatLngLiteral;
}) {
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');
  const [chargingStations, setChargingStations] = useState<
    google.maps.places.PlaceResult[]
  >([]);
  const [selectedStation, setSelectedStation] =
    useState<google.maps.places.PlaceResult | null>(null);

  useEffect(() => {
    if (!placesLibrary || !map) return;

    const service = new placesLibrary.PlacesService(map);
    const request = {
      location: center,
      radius: '5000', // 5 km radius
      type: ['electric_vehicle_charging_station'],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setChargingStations(results);
      }
    });
  }, [placesLibrary, map, center]);

  return (
    <>
      {chargingStations.map((station, index) => (
        <Marker
          key={index}
          position={station.geometry?.location}
          title={station.name}
          onClick={() => setSelectedStation(station)}
        />
      ))}
      {selectedStation && selectedStation.geometry?.location && (
        <InfoWindow
          position={selectedStation.geometry.location}
          onCloseClick={() => setSelectedStation(null)}
        >
          <div className="p-4 text-black bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-bold">{selectedStation.name}</h2>
            <p className="text-sm">{selectedStation.vicinity}</p>
            {selectedStation.rating && (
              <p className="text-sm">Rating: {selectedStation.rating}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}

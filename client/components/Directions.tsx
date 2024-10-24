"use client";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

interface DirectionsProps {
  origin: google.maps.LatLng | null;
  destination: google.maps.LatLng | null;
}

export default function Directions({ origin, destination }: DirectionsProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
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
      isBlurred
      className="absolute left-10 bottom-10 flex justify-center items-center z-10 w-4/12"
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

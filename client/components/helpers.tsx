export const fetchNearestChargingStation = async (origin: {
  lat: number;
  lng: number;
}): Promise<
  { location: { latitude: number; longitude: number } } | null | undefined
> => {
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
                latitude: origin.lat,
                longitude: origin.lng,
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
    console.log("Charging Stations:", data); // Log the results to verify data

    return findNearestStation(origin, data.places);
  } catch (error) {
    console.error("Error fetching charging stations:", error);
  }
};

export const findNearestStation = (
  origin: any,
  stations: { location: { latitude: any; longitude: any } }[]
) => {
  let nearestStation = null;
  let minDistance = Infinity;

  stations.forEach(
    (station: { location: { latitude: any; longitude: any } }) => {
      const distance = getDistance(origin, {
        lat: station.location.latitude,
        lng: station.location.longitude,
      });

      if (distance < minDistance) {
        nearestStation = station;
        minDistance = distance;
      }
    }
  );

  return nearestStation;
};

const getDistance = (
  origin: { lat: number; lng: number },
  destination: { lat: any; lng: any }
) => {
  const R = 6371e3; // metres
  const φ1 = (origin.lat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (destination.lat * Math.PI) / 180;
  const Δφ = ((destination.lat - origin.lat) * Math.PI) / 180;
  const Δλ = ((destination.lng - origin.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // in metres
  return distance;
};

// const haversineDistance = (lat1, lon1, lat2, lon2) => {
//   const toRad = (angle) => (Math.PI / 180) * angle;
//   const R = 6371; // Radius of the Earth in kilometers
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) *
//       Math.cos(toRad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in kilometers
// };

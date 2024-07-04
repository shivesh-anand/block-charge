import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Modal,
  useDisclosure,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@nextui-org/react';
import {
  PlaceOverview,
  PlaceDirectionsButton,
} from '@googlemaps/extended-component-library/react';

import React, { useEffect, useState } from 'react';
import { useMap, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import {
  Button,
  Modal,
  useDisclosure,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@nextui-org/react';
import {
  PlaceOverview,
  PlaceDirectionsButton,
} from '@googlemaps/extended-component-library/react';

const NearbySearchMap = ({ center }) => {
  const map = useMap();
  const [chargingStations, setChargingStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (!map) return;

    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: center,
      radius: '10000', // 10 km radius
      type: ['electric_vehicle_charging_station'],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setChargingStations(results);
      }
    });
  }, [map, center]);

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
          captureScroll={true}
        >
          <div className="p-4 text-gray-800 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-bold">{selectedStation.name}</h2>
            <p className="text-sm">{selectedStation.vicinity}</p>
            {selectedStation.rating && (
              <p className="text-sm">Rating: {selectedStation.rating}</p>
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
                {selectedStation?.name}
              </ModalHeader>
              <ModalBody className="w-full">
                <PlaceOverview
                  place={selectedStation.place_id}
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
};

export default NearbySearchMap;

export default NearbySearchMap;

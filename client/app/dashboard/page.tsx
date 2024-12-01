"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card, 
  CardBody
} from "@nextui-org/react";
import axios from "axios";

interface QueueItem {
  _id: string;
  email: string;
  vehicleType: string;
}

interface queueElement {
  _id: string,
  UserId: string,
  StationId: string
}

export default function UpdateStationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    queue: "",
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [items, setItems] = useState<queueElement[]>([]);
  const [loading, setLoading] = useState(false);
  const Socket: any = useRef();

  // const [stationData, setStationData] = useState<any>(null); // Adjust type as per your API response structure
  // // [token, setToken] = useState<string | null>();

  // useEffect(() => {
  //   fetchStationData();
  // }, []); // Fetch data on component mount

  // const fetchStationData = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/api/auth/validate-token",
  //       { token }
  //     );
  //     if (response.data.valid) {
  //       setStationData(response.data.user);
  //     } else {
  //       console.error("Invalid token");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching station data:", error);
  //   }
  // };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { id, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [id]: value,
  //   }));
  // };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!token) {
  //     console.log("Authorization token not found. Please log in again.");
  //     return;
  //   }

  //   try {
  //     // Filter out empty fields and create a payload
  //     const payload = {};
  //     Object.keys(formData).forEach((key) => {
  //       if (formData[key] !== "") {
  //         payload[key] = formData[key];
  //       }
  //     });

  //     const response = await axios.put(
  //       `http://localhost:5000/api/stations/${stationData.placeId}`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log("Update Successful", response.data);
  //     // Handle success, e.g., show success message
  //   } catch (error) {
  //     console.error("Update Failed", error.response?.data);

  //     // Handle error, e.g., show error message
  //   }
  // };

  // const handleFetchQueueItems = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/api/stations/${stationData.placeId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log("Queue Items:", response.data.queueItems);
  //     // Set state or handle the queue items data as needed
  //   } catch (error) {
  //     console.error("Error fetching queue items:", error.response?.data);
  //     // Handle error, e.g., show error message
  //   }
  // };

  // const handleDeleteQueueItem = async (email: string) => {
  //   try {
  //     const response = await axios.delete(
  //       `http://localhost:5000/api/stations/${stationData.placeId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         data: {
  //           email,
  //         },
  //       }
  //     );
  //     console.log("Delete Successful", response.data);
  //     // Handle success, e.g., update UI after deleting the queue item
  //   } catch (error) {
  //     console.error("Delete Failed", error.response?.data);
  //     // Handle error, e.g., show error message
  //   }
  // };

  //if (!stationData) return <p>Loading...</p>;

  const SendMessage = (e: string) => {
    console.log('TO:', e);
    if (Socket.current && Socket.current.readyState === WebSocket.OPEN) {
      Socket.current.send(JSON.stringify({from: '668634e5158bf29d41fc6bbf', to : e, text: 'verify', type: 'Station', success: 'true'}));
    } else {
      console.warn('WebSocket is not ready');
    }
  }

  const verificationHandler = async (e: string) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/queue/verify`,
        {
          stationId: '668634e5158bf29d41fc6bbf',
          userId: e
        }
      );

      if(response) {
        console.log('RESPONSE', response);
        const newArray = [];
        for(let i = 0; i < items.length; i++) {
            if(items[i].UserId === e) {
              continue;
            } 
            newArray.push(items[i]);
        }
        setItems(newArray);
        setLoading(false);
        SendMessage(e);
      }
    } catch(err) {
      console.log(e);
    }
  }

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5001');
    Socket.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ from: '668634e5158bf29d41fc6bbf', to: '', text: 'Initialize', type: 'Station', success: 'true' }));
    };

    ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data); 
        setItems(data);
        console.log('DATA', data);
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    }

    return () => {
      ws.close();
      Socket.current = null;
    }
  }, []);

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to dashboard
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Update One or more values
      </p>

      <form className="my-8">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="Tyler"
              type="text"
              value={formData.firstName}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Durden"
              type="text"
              value={formData.lastName}
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            value={formData.email}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={formData.password}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="queue">Queue</Label>
          <Input
            id="queue"
            placeholder="Enter current Queue e.g: 10,15,etc."
            type="text"
            value={formData.queue}
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Update &rarr;
          <BottomGradient />
        </button>
      </form>

      {/* Button to fetch queue items */}
      <button
        onClick={onOpen}
        className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] ${
          items.length > 0 ? "text-green-500" : "text-white"
        }`}
      >
        Fetch Queue Items
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Recent Check-Ins
              </ModalHeader>

              {/* Modal Body */}
               <ModalBody>
                  {Array.isArray(items) ? (
                    items.map((i: any) => (
                      <Card key={i.UserRef}>
                        <CardBody
                          style={{
                            display: "flex",
                            justifyContent: "space-between", 
                            alignItems: "center", 
                          }}
                        >
                          <div>{i.UserRef}</div>
                          {loading ? <p>Loading...</p> : <Button onClick={() => verificationHandler(i.UserRef)} color="success" variant="light">Verify</Button>}
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <div>No items to display</div>
                  )}
                </ModalBody>


              {/* Modal Footer */}
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Display queue items */}
      <div className="mt-4">
        <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200 mb-2">
          Queue Items
        </h3>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const initialQueueItems = [
  {
    _id: "1",
    userName: "John Doe",
    vehicleNumber: "XYZ1234",
    vehicleType: "Electric Car",
    email: "john.doe@example.com",
    checkInTime: "2024-12-03 10:30 AM",
  },
  {
    _id: "2",
    userName: "Jane Smith",
    vehicleNumber: "ABC5678",
    vehicleType: "Electric Scooter",
    email: "jane.smith@example.com",
    checkInTime: "2024-12-03 11:00 AM",
  },
];

function Queue() {
  const [queueItems, setQueueItems] = useState(initialQueueItems);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [cancelLoadingStates, setCancelLoadingStates] = useState<
    Record<string, boolean>
  >({});
  const Socket: any = useRef();

  const fetchQueueItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/queue/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ stationId: "668634e5158bf29d41fc6bbf" }), 
      });

      if (!response.ok) {
        throw new Error("Failed to fetch queue items");
      }

      const data = await response.json();
      console.log(data.users);
      setQueueItems(data.users || []);
    } catch (error: any) {
      console.error("Error fetching queue items:", error);
      toast.error("Failed to fetch queue items");
    }
  };

  const sendMessage = async (to: any) => {
    const token = localStorage.getItem("token");
    const stationId = "668634e5158bf29d41fc6bbf";
  
    if (!token) {
      toast.error("User is not authenticated");
      return;
    }
    console.log('TO:::', to._id);
    try {
      const response = await fetch("http://localhost:5000/api/queue/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ stationId, userId: to._id }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        if (Socket.current && Socket.current.readyState === WebSocket.OPEN) {
          Socket.current.send(
            JSON.stringify({
              from: stationId,
              to: to._id,
              text: "verify",
              type: "Station",
              success: true,
            })
          );
          toast.success("Verification successful");
        } else {
          console.warn("WebSocket is not ready");
        }
      } else {
        if (Socket.current && Socket.current.readyState === WebSocket.OPEN) {
          Socket.current.send(
            JSON.stringify({
              from: stationId,
              to: to._id,
              text: "verify",
              type: "Station",
              success: false,
            })
          );
        }
        toast.error(result.message || "Verification failed");
      }
    } catch (error: any) {
      console.error("Error during verification:", error);
      toast.error("An error occurred during verification");
    }
  };
  

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5001');
    Socket.current = ws;
  
    const initialize = async () => {
      await fetchQueueItems();
      const token = localStorage.getItem("token");
      console.log('initialize: ', token);
      ws.send(JSON.stringify({ from: '668634e5158bf29d41fc6bbf', to: '', text: 'Initialize', type: 'Station' }));
    };
  
    ws.onopen = () => {
      initialize();
    };
  
    ws.onmessage = async (message) => {
      console.log("WebSocket message received:", message.data);
      await fetchQueueItems();
    };
  
    return () => {
      ws.close();
      Socket.current = null;
    };
  }, []);
  

  const handleVerifyButtonClick = async (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    await sendMessage(id);
    setLoadingStates((prev) => ({ ...prev, [id]: false }));
    await fetchQueueItems();
  };
  const handleCancelButtonClick = (id: string) => {
    setCancelLoadingStates((prev) => ({ ...prev, [id]: true }));

    setTimeout(() => {
      setCancelLoadingStates((prev) => ({ ...prev, [id]: false }));
      setQueueItems((prev) => prev.filter((item) => item._id !== id));

      toast.success(`Queue item ${id} cancelled successfully`);
    }, 2000);
  };

  return (
    <div>
      <Card>
        <CardHeader className="font-extrabold text-5xl text-center justify-center items-center">
          Current Queue
        </CardHeader>
        <CardBody>
          {queueItems.length > 0 ? (
            queueItems.map((item) => (
              <Card key={item._id} className="mb-4">
                <CardBody>
                  <p>
                    <b>Name:</b> {item.userName}
                  </p>
                  <p>
                    <b>Vehicle Number:</b> {item.vehicleNumber}
                  </p>
                  <p>
                    <b>Vehicle Type:</b> {item.vehicleType}
                  </p>
                  <p>
                    <b>Email:</b> {item.email}
                  </p>
                  <p>
                    <b>Check-In Time:</b> {item.checkInTime}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      color="primary"
                      variant="ghost"
                      onPress={() => handleVerifyButtonClick(item._id)}
                      isLoading={loadingStates[item._id] || false}
                      isDisabled={loadingStates[item._id] || false}
                    >
                      Verify
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={() => handleCancelButtonClick(item._id)}
                      isLoading={cancelLoadingStates[item._id] || false}
                      isDisabled={cancelLoadingStates[item._id] || false}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <p>No queue items to display</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Queue;

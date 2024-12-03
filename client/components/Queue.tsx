import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useState } from "react";
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

  const handleVerifyButtonClick = (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));

    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
      setQueueItems((prev) => prev.filter((item) => item._id !== id));

      toast.success("Queue item verified successfully");
    }, 2000);
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

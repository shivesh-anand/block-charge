import { Card, CardBody, CardHeader } from "@nextui-org/react";

const blockchainTransactions = [
  {
    _id: "t1",
    from: "User1",
    to: "Station1",
    data: "Check-in transaction",
    timestamp: 1701620400000, // Unix timestamp for 2024-12-03 10:00 AM
    blockIndex: 5,
  },
  {
    _id: "t2",
    from: "User2",
    to: "Station1",
    data: "Payment transaction",
    timestamp: 1701624000000, // Unix timestamp for 2024-12-03 11:00 AM
    blockIndex: 6,
  },
];

function TransactionHistory() {
  return (
    <div>
      <Card>
        <CardHeader className="font-extrabold text-5xl text-center justify-center items-center">
          Transaction History
        </CardHeader>
        <CardBody>
          {blockchainTransactions.length > 0 ? (
            blockchainTransactions.map((tx) => (
              <Card key={tx._id} className="mb-4">
                <CardBody>
                  <p>
                    <b>Transaction ID:</b> {tx._id}
                  </p>
                  <p>
                    <b>From:</b> {tx.from}
                  </p>
                  <p>
                    <b>To:</b> {tx.to}
                  </p>
                  <p>
                    <b>Data:</b> {tx.data}
                  </p>
                  <p>
                    <b>Timestamp:</b> {new Date(tx.timestamp).toLocaleString()}
                  </p>
                  <p>
                    <b>Block Index:</b> {tx.blockIndex}
                  </p>
                </CardBody>
              </Card>
            ))
          ) : (
            <p>No blockchain transactions to display</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
export default TransactionHistory;

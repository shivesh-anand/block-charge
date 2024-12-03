import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// Dummy data for the stats
const dummyStats = {
  totalVerified: 120,
  totalCanceled: 30,
  totalQueueItems: 150,
  chargingPrices: {
    min: 5,
    max: 15,
    average: 10,
  },
  blockchain: {
    blocksMined: 1200,
    transactionsRecorded: 4500,
    activeNodes: 15,
  },
  peakHours: {
    labels: ["10 AM", "11 AM", "12 PM", "1 PM", "2 PM"],
    data: [10, 15, 25, 30, 40],
  },
  vehicleBrands: {
    labels: ["Tata", "Ola", "Mahindra", "Ather", "Hyundai"],
    data: [40, 25, 20, 10, 5],
  },
  chargerTypes: {
    labels: ["Type 1", "CHAdeMO", "CCS", "Type 2"],
    data: [30, 25, 25, 20],
  },
  checkInTrends: {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    data: [30, 25, 40, 35, 20],
  },
};

function StatsPage() {
  // Vehicle brands data
  const vehicleBrandsData = {
    labels: dummyStats.vehicleBrands.labels,
    datasets: [
      {
        data: dummyStats.vehicleBrands.data,
        backgroundColor: [
          "#2196f3",
          "#f44336",
          "#4caf50",
          "#ff9800",
          "#9c27b0",
        ],
      },
    ],
  };

  // Charger types data
  const chargerTypesData = {
    labels: dummyStats.chargerTypes.labels,
    datasets: [
      {
        data: dummyStats.chargerTypes.data,
        backgroundColor: ["#ff5722", "#4caf50", "#03a9f4", "#9c27b0"],
      },
    ],
  };

  // Bar chart for peak hours
  const peakHoursData = {
    labels: dummyStats.peakHours.labels,
    datasets: [
      {
        label: "Number of Check-Ins",
        data: dummyStats.peakHours.data,
        backgroundColor: "#4caf50",
      },
    ],
  };

  // Line chart for check-in trends
  const checkInTrendsData = {
    labels: dummyStats.checkInTrends.labels,
    datasets: [
      {
        label: "Check-Ins Over the Week",
        data: dummyStats.checkInTrends.data,
        borderColor: "#ff5722",
        fill: false,
      },
    ],
  };

  return (
    <div className="stats-page">
      <h1 className="text-center mb-8 font-extrabold text-5xl">
        Charging Station Statistics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Key Metrics */}
        <Card>
          <CardBody>
            <h3>Total Verified Users</h3>
            <p className="text-3xl font-bold">{dummyStats.totalVerified}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3>Total Canceled Requests</h3>
            <p className="text-3xl font-bold">{dummyStats.totalCanceled}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3>Total Queue Items</h3>
            <p className="text-3xl font-bold">{dummyStats.totalQueueItems}</p>
          </CardBody>
        </Card>

        {/* Charging Prices */}
        <Card>
          <CardBody>
            <h3>Charging Prices</h3>
            <p>
              <b>Min: ₹{dummyStats.chargingPrices.min}/kWh</b>
            </p>
            <p>
              <b>Max: ₹{dummyStats.chargingPrices.max}/kWh</b>
            </p>
            <p>
              <b>Average: ₹{dummyStats.chargingPrices.average}/kWh</b>
            </p>
          </CardBody>
        </Card>

        {/* Blockchain Stats */}
        <Card>
          <CardBody>
            <h3>Blockchain Statistics</h3>
            <p>
              <b>Blocks Mined: {dummyStats.blockchain.blocksMined}</b>
            </p>
            <p>
              <b>
                Transactions Recorded:{" "}
                {dummyStats.blockchain.transactionsRecorded}
              </b>
            </p>
            <p>
              <b>Active Nodes: {dummyStats.blockchain.activeNodes}</b>
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Brands Pie Chart */}
        <Card>
          <CardBody>
            <h3>Vehicle Brands</h3>
            <Pie data={vehicleBrandsData} />
          </CardBody>
        </Card>

        {/* Charger Types Pie Chart */}
        <Card>
          <CardBody>
            <h3>Charger Types</h3>
            <Pie data={chargerTypesData} />
          </CardBody>
        </Card>

        {/* Peak Hours Bar Chart */}
        <Card>
          <CardBody>
            <h3>Peak Hours</h3>
            <Bar data={peakHoursData} />
          </CardBody>
        </Card>

        {/* Check-In Trends Line Chart */}
        <Card className="col-span-2">
          <CardBody>
            <h3>Weekly Check-In Trends</h3>
            <Line data={checkInTrendsData} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default StatsPage;

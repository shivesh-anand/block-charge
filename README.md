# BlockCharge

A decentralized EV charging application designed to connect electric vehicle users with nearby charging stations. BlockCharge leverages blockchain technology to securely record and verify user check-ins at registered stations, while providing real-time data and IoT integration with the vehicle's battery.

## Features

- **User and Charging Station Accounts**: Register and log in as a user or a charging station.
- **Location-based Station Discovery**: Find EV charging stations within a 20km radius.
- **User Check-in and Queue Management**: Users can check in at stations and view their place in the queue.
- **Charging Station Dashboard**: Charging stations can update queue status, manage pricing, and verify check-ins.
- **Blockchain Security**: Key user actions are securely recorded on a private blockchain to ensure data integrity and transparency.
- **Role-Based Access**: Blockchain APIs and sensitive data are accessible only to logged-in users and admins.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), React, TypeScript
- **Backend**: [Node.js](https://nodejs.org/), Express, MongoDB, TypeScript
- **Blockchain**: Custom blockchain implementation with Validator-based Proof of Stake
- **Mapping API**: Google Maps API for route and station location display

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/blockcharge.git
   cd blockcharge
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root and add the following variables:
   ```plaintext
   NEXT_PUBLIC_BACKEND_URL=<backend_url>
   MONGO_URI=<your_mongodb_connection_string>
   GOOGLE_MAPS_API_KEY=<your_google_maps_api_key>
   ```

4. **Run the Application**:
   - **Backend**: 
     ```bash
     npm run server
     ```
   - **Frontend**:
     ```bash
     npm run client
     ```

## Blockchain Overview

The custom blockchain records essential user actions, such as check-ins and charging station interactions, in a secure, decentralized manner.

### Key Components:

- **Transaction**: Records actions between users and charging stations.
- **Block**: A collection of validated transactions.
- **Validator**: Validators participate in the Proof of Stake mechanism to validate new blocks.

### Sample Blockchain Flow:

1. **User Check-in**: Upon check-in, a transaction is created and added to the blockchain.
2. **Block Creation**: Validators validate the transaction and generate a new block.
3. **Transaction Verification**: The block is added to the chain if it passes all checks, preserving data integrity.

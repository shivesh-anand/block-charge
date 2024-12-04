import { Request, Response } from "express";
import { Blockchain, encryptData } from "../blockchain/blockchain.js";
import TransactionModel from "../models/transactionModel.js";

const blockChargeBlockchain = new Blockchain();

export const addTransaction = async (transactionData: {
  from: string;
  to: string;
  data: any;
  type: "SIGN_UP" | "VERIFICATION";
}) => {
  try {
    const { from, to, data, type } = transactionData;

    if (!["SIGN_UP", "VERIFICATION"].includes(type)) {
      throw new Error("Invalid transaction type");
    }

    const encryptedData = encryptData(JSON.stringify(data), "your-secret-key");

    const transaction = new TransactionModel({
      from,
      to,
      data: encryptedData,
      type,
      timestamp: Date.now(),
      blockIndex: blockChargeBlockchain.chain.length,
    });

    await transaction.save();

    blockChargeBlockchain.addBlock([transaction]);

    return {
      message: `${type} transaction added and block created successfully`,
      transaction,
    };
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw new Error("Server error");
  }
};

export const validateBlockchain = (req: Request, res: Response) => {
  const isValid = blockChargeBlockchain.isChainValid();
  return res.status(200).json({ isValid });
};

export const getTransactions = async (req: Request, res: Response) => {
  const { stationId } = req.params;

  try {
    const transactions = await TransactionModel.find({ to: stationId }).sort({
      timestamp: -1,
    });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
